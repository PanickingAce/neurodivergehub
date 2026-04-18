import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/theme-context";
import { useAccount } from "@/contexts/account-context";
import { Sun, Moon, Contrast, Type, Eye, ZoomIn, Wind, User, LogOut, Trash2, Shield, AlertTriangle, Bell } from "lucide-react";

export default function Settings() {
  const { theme, setTheme, dyslexiaFont, setDyslexiaFont, reducedMotion, setReducedMotion } = useTheme();
  const { account, isLoggedIn, createAccount, login, logout, updateAccount, deleteAccount } = useAccount();

  const [tab, setTab] = useState(isLoggedIn ? "account" : "signin");
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [signUpForm, setSignUpForm] = useState({ username: "", email: "", displayName: "", password: "", confirmPassword: "" });
  const [editForm, setEditForm] = useState({ displayName: account?.displayName || "", username: account?.username || "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [focusMode, setFocusMode] = useState(() => localStorage.getItem("nd-focus-mode") === "true");
  const [textSize, setTextSize] = useState<string>(() => localStorage.getItem("nd-text-size") || "normal");
  const [highFocus, setHighFocus] = useState(() => localStorage.getItem("nd-high-focus") === "true");
  const [lineSpacing, setLineSpacing] = useState<string>(() => localStorage.getItem("nd-line-spacing") || "normal");
  const [cursorSize, setCursorSize] = useState<string>(() => localStorage.getItem("nd-cursor-size") || "normal");

  const showMsg = (type: "success" | "error", msg: string) => {
    if (type === "success") { setSuccess(msg); setError(""); setTimeout(() => setSuccess(""), 3000); }
    else { setError(msg); setSuccess(""); }
  };

  const handleSignIn = () => {
    if (!signInForm.email || !signInForm.password) return showMsg("error", "Please fill in all fields.");
    const result = login(signInForm.email, signInForm.password);
    if (!result.success) showMsg("error", result.error || "Login failed.");
    else { showMsg("success", "Welcome back!"); setTab("account"); }
  };

  const handleSignUp = () => {
    if (!signUpForm.username || !signUpForm.email || !signUpForm.displayName || !signUpForm.password)
      return showMsg("error", "Please fill in all required fields.");
    if (signUpForm.password !== signUpForm.confirmPassword)
      return showMsg("error", "Passwords don't match.");
    if (signUpForm.password.length < 6)
      return showMsg("error", "Password must be at least 6 characters.");
    const result = createAccount(signUpForm);
    if (!result.success) showMsg("error", result.error || "Could not create account.");
    else { showMsg("success", "Account created!"); setTab("account"); }
  };

  const handleUpdateProfile = () => {
    if (!editForm.displayName.trim()) return showMsg("error", "Display name is required.");
    updateAccount({ displayName: editForm.displayName, username: editForm.username });
    showMsg("success", "Profile updated.");
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    setShowDeleteConfirm(false);
    setTab("signin");
  };

  const setLocalPref = (key: string, value: string, setter: (v: string) => void) => {
    setter(value);
    localStorage.setItem(key, value);
    document.documentElement.setAttribute(`data-${key}`, value);
  };

  const setLocalBool = (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    localStorage.setItem(key, String(value));
    document.documentElement.classList.toggle(key, value);
  };

  return (
    <PageShell title="Settings">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">Settings</h2>
          <p className="text-muted-foreground text-sm">Customise your experience. Changes are saved automatically.</p>
        </div>

        {(error || success) && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${success ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>
            {success || error}
          </div>
        )}

        <div className="space-y-5">
          {/* Display */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-base">Display</CardTitle>
              </div>
              <CardDescription>Adjust colours, fonts, and animations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Theme</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Dawn (light), Night (dark), or High Contrast</p>
                </div>
                <Select value={theme} onValueChange={(v: "dawn" | "night" | "hc") => setTheme(v)}>
                  <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dawn"><div className="flex items-center gap-2"><Sun className="w-3 h-3" />Dawn</div></SelectItem>
                    <SelectItem value="night"><div className="flex items-center gap-2"><Moon className="w-3 h-3" />Night</div></SelectItem>
                    <SelectItem value="hc"><div className="flex items-center gap-2"><Contrast className="w-3 h-3" />High Contrast</div></SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1.5"><Type className="w-4 h-4" />Dyslexia-friendly font</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Switches to Atkinson Hyperlegible</p>
                </div>
                <Switch checked={dyslexiaFont} onCheckedChange={setDyslexiaFont} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1.5"><Wind className="w-4 h-4" />Reduce motion</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Turns off animations and transitions</p>
                </div>
                <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
              </div>
            </CardContent>
          </Card>

          {/* Reading & Accessibility */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-base">Reading & Accessibility</CardTitle>
              </div>
              <CardDescription>Adjust text, spacing, and focus options for comfortable reading.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1.5"><ZoomIn className="w-4 h-4" />Text size</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Affects body text across all pages</p>
                </div>
                <Select value={textSize} onValueChange={(v) => setLocalPref("nd-text-size", v, setTextSize)}>
                  <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="xl">Extra large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Line spacing</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Extra space between lines can aid reading</p>
                </div>
                <Select value={lineSpacing} onValueChange={(v) => setLocalPref("nd-line-spacing", v, setLineSpacing)}>
                  <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="relaxed">Relaxed</SelectItem>
                    <SelectItem value="loose">Loose</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="focus-mode" className="text-sm font-medium cursor-pointer">Focus mode</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Hides decorative elements to reduce visual noise</p>
                </div>
                <Switch id="focus-mode" checked={focusMode} onCheckedChange={(v) => setLocalBool("nd-focus-mode", v, setFocusMode)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reading-highlight" className="text-sm font-medium cursor-pointer">Reading focus highlight</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Dims surrounding content while you read</p>
                </div>
                <Switch id="reading-highlight" checked={highFocus} onCheckedChange={(v) => setLocalBool("nd-high-focus", v, setHighFocus)} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Cursor size</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Larger cursor can be easier to track</p>
                </div>
                <Select value={cursorSize} onValueChange={(v) => setLocalPref("nd-cursor-size", v, setCursorSize)}>
                  <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-base">Account</CardTitle>
              </div>
              <CardDescription>
                {isLoggedIn
                  ? `Signed in as ${account?.displayName}. Your preferences are saved to your account.`
                  : "Create an account to keep your settings and planner across sessions."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoggedIn ? (
                <Tabs value={tab} onValueChange={setTab}>
                  <TabsList className="grid grid-cols-2 w-full max-w-xs mb-5 bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="account" className="rounded-lg">Profile</TabsTrigger>
                    <TabsTrigger value="danger" className="rounded-lg">Manage</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account" className="space-y-4">
                    <div className="bg-muted/30 rounded-xl px-4 py-3 text-sm space-y-1">
                      <p><span className="text-muted-foreground">Email: </span>{account?.email}</p>
                      <p><span className="text-muted-foreground">Member since: </span>{account?.createdAt ? new Date(account.createdAt).toLocaleDateString() : "—"}</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs mb-1 block">Display name</Label>
                        <Input value={editForm.displayName} onChange={e => setEditForm({ ...editForm, displayName: e.target.value })} />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Username</Label>
                        <Input value={editForm.username} onChange={e => setEditForm({ ...editForm, username: e.target.value })} />
                      </div>
                      <Button onClick={handleUpdateProfile} size="sm">Save changes</Button>
                    </div>
                    <div className="pt-2 border-t border-border/40">
                      <Button variant="outline" size="sm" className="gap-2 text-muted-foreground" onClick={logout}>
                        <LogOut className="w-4 h-4" /> Sign out
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="danger" className="space-y-4">
                    <div className="border border-red-200 dark:border-red-900/50 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-600 dark:text-red-400">Delete account</p>
                          <p className="text-xs text-muted-foreground mt-1">This will permanently delete your account and all saved data. Cannot be undone.</p>
                        </div>
                      </div>
                      {!showDeleteConfirm ? (
                        <Button variant="destructive" size="sm" className="mt-4 gap-2" onClick={() => setShowDeleteConfirm(true)}>
                          <Trash2 className="w-4 h-4" /> Delete my account
                        </Button>
                      ) : (
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
                            <AlertTriangle className="w-4 h-4" /> Are you sure? This cannot be undone.
                          </div>
                          <div className="flex gap-2">
                            <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>Yes, delete</Button>
                            <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <Tabs value={tab} onValueChange={setTab}>
                  <TabsList className="grid grid-cols-2 w-full max-w-xs mb-5 bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="signin" className="rounded-lg">Sign In</TabsTrigger>
                    <TabsTrigger value="create" className="rounded-lg">Create Account</TabsTrigger>
                  </TabsList>
                  <TabsContent value="signin" className="space-y-3">
                    <div>
                      <Label className="text-xs mb-1 block">Email</Label>
                      <Input type="email" placeholder="your@email.com" value={signInForm.email} onChange={e => setSignInForm({ ...signInForm, email: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Password</Label>
                      <Input type="password" placeholder="••••••••" value={signInForm.password} onChange={e => setSignInForm({ ...signInForm, password: e.target.value })} />
                    </div>
                    <Button onClick={handleSignIn} className="w-full">Sign In</Button>
                  </TabsContent>
                  <TabsContent value="create" className="space-y-3">
                    <div>
                      <Label className="text-xs mb-1 block">Display name *</Label>
                      <Input placeholder="How you'd like to be called" value={signUpForm.displayName} onChange={e => setSignUpForm({ ...signUpForm, displayName: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Username *</Label>
                      <Input placeholder="e.g. quietmind" value={signUpForm.username} onChange={e => setSignUpForm({ ...signUpForm, username: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Email *</Label>
                      <Input type="email" placeholder="your@email.com" value={signUpForm.email} onChange={e => setSignUpForm({ ...signUpForm, email: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Password * (min. 6 characters)</Label>
                      <Input type="password" placeholder="••••••••" value={signUpForm.password} onChange={e => setSignUpForm({ ...signUpForm, password: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Confirm password *</Label>
                      <Input type="password" placeholder="••••••••" value={signUpForm.confirmPassword} onChange={e => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })} />
                    </div>
                    <Button onClick={handleSignUp} className="w-full">Create Account</Button>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* Notifications placeholder */}
          <Card className="border-border/50 opacity-60">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-base">Notifications</CardTitle>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Coming soon</span>
              </div>
              <CardDescription>Email digests and gentle reminders.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
