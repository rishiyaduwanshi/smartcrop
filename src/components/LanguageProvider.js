"use client";

import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

const STORAGE_KEY = "smartcrop.language";
const GOOGLE_COOKIE_KEY = "googtrans";
const DEFAULT_LANGUAGE = "en";
const GOOGLE_SCRIPT_ID = "smartcrop-google-translate-script";
const GOOGLE_INIT_CALLBACK = "smartcropGoogleTranslateInit";
const GOOGLE_CONTAINER_ID = "google_translate_element";
const ROUTE_TRANSLATION_MASK_MS = 700;

const LANGUAGE_OPTIONS = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "bn", label: "Bengali" },
    { code: "te", label: "Telugu" },
    { code: "mr", label: "Marathi" },
    { code: "ta", label: "Tamil" },
    { code: "ur", label: "Urdu" },
    { code: "gu", label: "Gujarati" },
    { code: "kn", label: "Kannada" },
    { code: "ml", label: "Malayalam" },
    { code: "pa", label: "Punjabi" },
    { code: "or", label: "Odia" },
    { code: "as", label: "Assamese" },
];

const INCLUDED_LANGUAGES = LANGUAGE_OPTIONS.filter(
    (language) => language.code !== DEFAULT_LANGUAGE,
)
    .map((language) => language.code)
    .join(",");

function isSupportedLanguage(languageCode) {
    return LANGUAGE_OPTIONS.some((language) => language.code === languageCode);
}

function setGoogleTranslateCookie(languageCode) {
    const cookieValue = `/en/${languageCode}`;
    Cookies.set(GOOGLE_COOKIE_KEY, cookieValue, { path: "/" });

    if (window.location.hostname.includes(".")) {
        Cookies.set(GOOGLE_COOKIE_KEY, cookieValue, {
            path: "/",
            domain: `.${window.location.hostname}`,
        });
    }
}

function applyGoogleLanguage(languageCode, retries = 0) {
    setGoogleTranslateCookie(languageCode);

    const languageDropdown = document.querySelector(".goog-te-combo");
    if (languageDropdown) {
        languageDropdown.value = languageCode;
        languageDropdown.dispatchEvent(new Event("change"));
        return;
    }

    if (retries < 20) {
        window.setTimeout(
            () => applyGoogleLanguage(languageCode, retries + 1),
            150,
        );
    }
}

let googleContainer = null;

function ensureGoogleTranslateContainer() {
    if (googleContainer && document.body.contains(googleContainer)) {
        return googleContainer;
    }

    if (!document.body) {
        document.addEventListener(
            "DOMContentLoaded",
            ensureGoogleTranslateContainer,
            { once: true },
        );
        return null;
    }

    googleContainer = document.getElementById(GOOGLE_CONTAINER_ID);

    if (!googleContainer) {
        const container = document.createElement("div");
        container.id = GOOGLE_CONTAINER_ID;
        container.setAttribute("aria-hidden", "true");
        container.classList.add("hidden-translate-container");

        document.body.appendChild(container);
        googleContainer = container;
    }

    return googleContainer;
}

function hideGoogleTranslateChrome() {
    const bannerFrame = document.querySelector("iframe.goog-te-banner-frame");
    if (bannerFrame instanceof HTMLElement) {
        if (bannerFrame.style.display !== "none") {
            bannerFrame.style.display = "none";
        }
        if (bannerFrame.style.visibility !== "hidden") {
            bannerFrame.style.visibility = "hidden";
        }
    }

    const chromeElements = document.querySelectorAll(
        "body > .skiptranslate, body > .goog-tooltip, .goog-te-banner-frame.skiptranslate, #goog-gt-tt, .goog-te-spinner-pos, .goog-te-spinner, .goog-tooltip, .goog-text-highlight, .VIpgJd-ZVi9od-aZ66s-b9vBjn, .VIpgJd-ZVi9od-ORHb-OEVmcd",
    );

    for (const element of chromeElements) {
        if (element instanceof HTMLElement) {
            if (element.style.display !== "none") {
                element.style.display = "none";
            }
            if (element.style.visibility !== "hidden") {
                element.style.visibility = "hidden";
            }
        }
    }

    if (document.body.style.top !== "0px") {
        document.body.style.top = "0px";
    }
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANGUAGE);
    const [isTranslatorReady, setIsTranslatorReady] = useState(false);
    const [isRouteTranslating, setIsRouteTranslating] = useState(false);
    const previousLanguageRef = useRef(DEFAULT_LANGUAGE);
    const pathname = usePathname();
    const previousPathnameRef = useRef(null);

    useEffect(() => {
        const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
        if (savedLanguage && isSupportedLanguage(savedLanguage)) {
            setSelectedLanguage(savedLanguage);
        }
    }, []);

    useEffect(() => {
        const initializeGoogleTranslator = () => {
            if (!window.google?.translate?.TranslateElement) {
                return;
            }

            ensureGoogleTranslateContainer();

            if (!window.__smartcropGoogleTranslateInitialized) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: DEFAULT_LANGUAGE,
                        includedLanguages: INCLUDED_LANGUAGES,
                        autoDisplay: false,
                    },
                    GOOGLE_CONTAINER_ID,
                );
                window.__smartcropGoogleTranslateInitialized = true;
            }

            setIsTranslatorReady(true);
        };

        window[GOOGLE_INIT_CALLBACK] = initializeGoogleTranslator;

        if (window.google?.translate?.TranslateElement) {
            initializeGoogleTranslator();
            return () => {
                delete window[GOOGLE_INIT_CALLBACK];
            };
        }

        if (!document.getElementById(GOOGLE_SCRIPT_ID)) {
            const script = document.createElement("script");
            script.id = GOOGLE_SCRIPT_ID;
            script.src = `https://translate.google.com/translate_a/element.js?cb=${GOOGLE_INIT_CALLBACK}`;
            script.async = true;
            document.body.appendChild(script);
        }

        return () => {
            delete window[GOOGLE_INIT_CALLBACK];
        };
    }, []);

    useEffect(() => {
        if (!isTranslatorReady) {
            return;
        }

        document.documentElement.lang = selectedLanguage;
        setGoogleTranslateCookie(selectedLanguage);

        if (selectedLanguage === DEFAULT_LANGUAGE) {
            if (previousLanguageRef.current !== DEFAULT_LANGUAGE) {
                window.location.reload();
            }
        } else {
            applyGoogleLanguage(selectedLanguage);
        }

        hideGoogleTranslateChrome();

        const intervalId = window.setInterval(hideGoogleTranslateChrome, 250);
        const timeoutId = window.setTimeout(() => {
            window.clearInterval(intervalId);
        }, 3000);

        previousLanguageRef.current = selectedLanguage;

        return () => {
            window.clearInterval(intervalId);
            window.clearTimeout(timeoutId);
        };
    }, [isTranslatorReady, selectedLanguage]);

    useEffect(() => {
        const currentPathname = pathname ?? "";
        const previousPathname = previousPathnameRef.current;
        previousPathnameRef.current = currentPathname;

        if (!isTranslatorReady || selectedLanguage === DEFAULT_LANGUAGE) {
            setIsRouteTranslating(false);
            return;
        }

        if (previousPathname === null || previousPathname === currentPathname) {
            return;
        }

        setIsRouteTranslating(true);
        applyGoogleLanguage(selectedLanguage);
        hideGoogleTranslateChrome();

        const intervalId = window.setInterval(() => {
            applyGoogleLanguage(selectedLanguage);
            hideGoogleTranslateChrome();
        }, 180);

        const timeoutId = window.setTimeout(() => {
            window.clearInterval(intervalId);
            setIsRouteTranslating(false);
        }, ROUTE_TRANSLATION_MASK_MS);

        return () => {
            window.clearInterval(intervalId);
            window.clearTimeout(timeoutId);
            setIsRouteTranslating(false);
        };
    }, [isTranslatorReady, pathname, selectedLanguage]);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, selectedLanguage);
    }, [selectedLanguage]);

    const value = useMemo(
        () => ({
            language: selectedLanguage,
            setLanguage: (nextLanguage) => {
                if (isSupportedLanguage(nextLanguage)) {
                    setSelectedLanguage(nextLanguage);
                }
            },
            languages: LANGUAGE_OPTIONS,
            isTranslatorReady,
            isRouteTranslating,
        }),
        [isRouteTranslating, isTranslatorReady, selectedLanguage],
    );

    return (
        <LanguageContext.Provider value={value}>
            {isRouteTranslating && (
                <div className="translation-route-mask" aria-hidden="true">
                    <div className="translation-route-mask__card">
                        <div className="translation-route-mask__line translation-route-mask__line--lg" />
                        <div className="translation-route-mask__line translation-route-mask__line--md" />
                        <div className="translation-route-mask__line" />
                        <div className="translation-route-mask__line" />
                        <div className="translation-route-mask__line translation-route-mask__line--sm" />
                    </div>
                </div>
            )}
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
}
