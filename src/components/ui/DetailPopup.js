"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export default function DetailPopup({ isOpen, onClose, title, subtitle, badge, children }) {
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Close popup"
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="relative z-10 w-full max-w-4xl max-h-[88vh] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                        {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
                    </div>
                    <div className="flex items-center gap-3">
                        {badge}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close details"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="max-h-[calc(88vh-88px)] overflow-y-auto px-5 py-5 sm:px-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
