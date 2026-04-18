import { motion } from "framer-motion";
import { ArrowRight, Bookmark } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { useLocation } from "wouter";

interface AppCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
  delay?: number;
  href?: string;
}

export function AppCard({
  title,
  description,
  icon,
  tags,
  delay = 0,
  href,
}: AppCardProps) {
  const { reducedMotion } = useTheme();
  const [, setLocation] = useLocation();

  const handleLaunch = () => {
    if (href) setLocation(href);
  };

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: reducedMotion ? 0 : delay }}
      viewport={{ once: true }}
    >
      <div
        className="
        bg-[var(--card)]
        border border-[var(--border)]
        rounded-2xl
        p-4
        space-y-4
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]
        hover:-translate-y-[2px]
        transition-all duration-200
        "
      >

        {/* TOP */}
        <div className="flex justify-between items-start">

          <div className="flex gap-3 items-start">

            {/* ICON */}
            <div className="w-10 h-10 rounded-xl bg-[var(--muted)] flex items-center justify-center text-[var(--primary)]">
              {icon}
            </div>

            {/* TEXT */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-[var(--text)]">
                {title}
              </p>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                {description}
              </p>
            </div>

          </div>

          {/* BOOKMARK */}
          <button className="text-[var(--muted)] hover:text-[var(--text)] transition">
            <Bookmark className="w-4 h-4" />
          </button>

        </div>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="
              text-[10px]
              px-2 py-1
              rounded-full
              bg-[var(--muted)]
              text-[var(--text)]
              opacity-70
              "
            >
              {tag}
            </span>
          ))}
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLaunch}
          className="
          w-full
          text-sm
          rounded-xl
          border border-[var(--border)]
          py-2
          flex items-center justify-center gap-2
          text-[var(--text)]
          bg-transparent
          hover:bg-[var(--primary)]
          hover:text-white
          transition-all duration-200
          "
        >
          Open App
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </motion.div>
  );
}