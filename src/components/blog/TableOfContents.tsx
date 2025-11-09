import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function TableOfContents({ items, position = "left" }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    items.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (items.length === 0) return null;

  if (position === "top") {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Table of Contents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <nav>
            <ol className="space-y-2">
              {items.map((item, index) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleClick(item.id)}
                    className={`text-left w-full hover:text-[#132847] transition-colors ${
                      item.level === 3 ? 'pl-4 text-sm' : 'font-medium'
                    } ${activeId === item.id ? 'text-[#132847] font-semibold' : 'text-gray-700'}`}
                  >
                    {index + 1}. {item.text}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-[#132847] flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Contents
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <nav>
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={`text-left w-full hover:text-[#132847] transition-colors ${
                    item.level === 3 ? 'pl-4 text-xs' : ''
                  } ${activeId === item.id ? 'text-[#132847] font-semibold' : 'text-gray-600'}`}
                >
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}