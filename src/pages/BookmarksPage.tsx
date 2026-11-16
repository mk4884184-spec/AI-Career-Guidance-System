import React from "react";
import { useCareer } from "../hooks/useCareer";
import { Bookmark, Trash2, Map, Compass, ExternalLink } from "lucide-react";

export const BookmarksPage: React.FC = () => {
  const { bookmarks, removeBookmark } = useCareer();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 mb-2">
          <Bookmark className="w-3.5 h-3.5" /> Saved Career Items
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Your Saved Bookmarks
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Access your saved career paths, custom learning roadmaps, and target job roles in one place.
        </p>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 uppercase tracking-wider">
                  {bm.itemType}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{bm.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {bm.data?.description || "Saved custom roadmap milestone package"}
                </p>
              </div>

              <button
                onClick={() => removeBookmark(bm.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                title="Remove Bookmark"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Bookmarks Saved Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Bookmark career paths or roadmaps by clicking the bookmark icon on any recommendation card.
          </p>
        </div>
      )}
    </div>
  );
};
