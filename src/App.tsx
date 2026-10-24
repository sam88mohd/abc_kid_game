import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2, Mic, MicOff, Star,
  Sparkles, HelpCircle, ShieldCheck
} from 'lucide-react';

interface LetterItem {
  letter: string;
  word: string;
  emoji: string;
}

const ALPHABET: LetterItem[] = [
  { letter: 'A', word: 'Apple', emoji: '🍎' },
  { letter: 'B', word: 'Ball', emoji: '⚽' },
  { letter: 'C', word: 'Cat', emoji: '🐱' },
  { letter: 'D', word: 'Dog', emoji: '🐶' },
  { letter: 'E', word: 'Elephant', emoji: '🐘' },
  { letter: 'F', word: 'Fish', emoji: '🐟' },
  { letter: 'G', word: 'Giraffe', emoji: '🦒' },
  { letter: 'H', word: 'Hat', emoji: '🎩' },
  { letter: 'I', word: 'Ice Cream', emoji: '🍦' },
  { letter: 'J', word: 'Juice', emoji: '🧃' },
  { letter: 'K', word: 'Kite', emoji: '🪁' },
  { letter: 'L', word: 'Lion', emoji: '🦁' },
  { letter: 'M', word: 'Monkey', emoji: '🐵' },
  { letter: 'N', word: 'Nest', emoji: '🪹' },
  { letter: 'O', word: 'Owl', emoji: '🦉' },
  { letter: 'P', word: 'Pencil', emoji: '✏️' },
  { letter: 'Q', word: 'Queen', emoji: '👑' },
  { letter: 'R', word: 'Rabbit', emoji: '🐰' },
  { letter: 'S', word: 'Sun', emoji: '☀️' },
  { letter: 'T', word: 'Tree', emoji: '🌳' },
  { letter: 'U', word: 'Umbrella', emoji: '☂️' },
  { letter: 'V', word: 'Violin', emoji: '🎻' },
  { letter: 'W', word: 'Whale', emoji: '🐳' },
  { letter: 'X', word: 'Xylophone', emoji: '🎹' },
  { letter: 'Y', word: 'Yarn', emoji: '🧶' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓' },
];

// Expanded phonetic dictionary so single letter sounds match instantly
const PHONETIC_MAP: Record<string, string[]> = {
  A: ['a', 'ay', 'ey', 'eh', 'apple', 'hey', 'day', 'say a', 'say ay'],
  B: ['b', 'bee', 'be', 'ball', 'say b', 'say bee'],
  C: ['c', 'see', 'sea', 'cat', 'say c', 'say see'],
  D: ['d', 'dee', 'dog', 'say d', 'say dee'],
  E: ['e', 'ee', 'elephant', 'say e'],
  F: ['f', 'eff', 'fish', 'say f'],
  G: ['g', 'gee', 'giraffe', 'say g'],
  H: ['h', 'aitch', 'hat', 'say h'],
  I: ['i', 'eye', 'ice', 'say i'],
  J: ['j', 'jay', 'juice', 'say j'],
  K: ['k', 'kay', 'kite', 'say k'],
  L: ['l', 'ell', 'lion', 'say l'],
  M: ['m', 'em', 'monkey', 'say m'],
  N: ['n', 'en', 'nest', 'say n'],
  O: ['o', 'oh', 'owl', 'say o'],
  P: ['p', 'pee', 'pencil', 'say p'],
  Q: ['q', 'cue', 'queue', 'queen', 'say q'],
  R: ['r', 'ar', 'rabbit', 'say r'],
  S: ['s', 'ess', 'sun', 'say s'],
  T: ['t', 'tee', 'tree', 'say t'],
  U: ['u', 'you', 'umbrella', 'say u'],
  V: ['v', 'vee', 'violin', 'say v'],
  W: ['w', 'double u', 'whale', 'say w'],
  X: ['x', 'ex', 'xylophone', 'say x'],
  Y: ['y', 'why', 'yarn', 'say y'],
  Z: ['z', 'zee', 'zed', 'zebra', 'say z']
};

export default function App() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("Tap the microphone and say the letter!");
  const [transcript, setTranscript] = useState<string>("");
  const [gameMode, setGameMode] = useState<'learn' | 'tap'>('learn');
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [unlockedLetters, setUnlockedLetters] = useState<number>(1);
  const [tapOptions, setTapOptions] = useState<LetterItem[]>([]);
  const [praise, setPraise] = useState<string>("");

  const currentItem = ALPHABET[currentIndex];
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Kept continuous so it catches short sounds better
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setFeedback(`Listening... Say "${currentItem.letter}"!`);
      };

      recognition.onresult = (event: any) => {
        let speechToText = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          speechToText += event.results[i][0].transcript;
        }
        speechToText = speechToText.trim().toLowerCase();
        setTranscript(speechToText);

        const allowedPhrases = PHONETIC_MAP[currentItem.letter] || [currentItem.letter.toLowerCase()];
        const isMatch = allowedPhrases.some(phrase => speechToText.includes(phrase));

        if (isMatch) {
          try {
            recognition.stop();
          } catch {}
          handleSuccess();
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setFeedback("Microphone busy. Try Parent Pass or Tap Mode!");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [currentIndex]);

  useEffect(() => {
    if (gameMode === 'tap') {
      const others = ALPHABET.filter((_, idx) => idx !== currentIndex)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      const mixed = [currentItem, ...others].sort(() => 0.5 - Math.random());
      setTapOptions(mixed);
    }
  }, [currentIndex, gameMode]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSuccess = () => {
    setStars((prev: number) => prev + 10);
    setUnlockedLetters((prev: number) => Math.max(prev, currentIndex + 2));
    const praises = ["🎉 Great job!", "⭐ Superstar!", "🚀 Perfect!", "🥳 High five!"];
    setPraise(praises[Math.floor(Math.random() * praises.length)]);
    speakText(`Correct! ${currentItem.letter}!`);

    setTimeout(() => {
      setPraise("");
      if (currentIndex < ALPHABET.length - 1) {
        setCurrentIndex((prev: number) => prev + 1);
      }
    }, 1500);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {
        try {
          recognitionRef.current.stop();
        } catch {}
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch {}
        }, 100);
      }
    } else {
      alert("Speech recognition is not supported on this browser. Use Parent Pass or Tap Mode!");
    }
  };

  return (
    <div className="min-h-screen bg-indigo-600 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white flex flex-col items-center justify-between p-6 select-none font-sans">

      {/* Header */}
      <header className="w-full max-w-xl flex flex-row justify-between items-center py-4 px-6 bg-white/20 backdrop-blur-md rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎈</span>
          <h1 className="text-2xl font-black tracking-wide text-yellow-300 drop-shadow">ABC Phonics</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-yellow-400 text-yellow-950 px-4 py-1.5 rounded-full font-bold shadow-md text-base">
            <Star className="w-5 h-5 fill-yellow-950 mr-1.5" />
            <span>{stars}</span>
          </div>
          <button
            onClick={() => setShowHelpModal(true)}
            className="bg-white/20 p-2.5 rounded-full hover:bg-white/30 transition cursor-pointer"
            title="Help & Mic Permissions"
          >
            <HelpCircle className="w-6 h-6 text-white" />
          </button>
        </div>
      </header>

      {/* Mode Switcher */}
      <div className="flex gap-3 my-4 bg-white/20 p-2 rounded-2xl backdrop-blur-md">
        <button
          onClick={() => setGameMode('learn')}
          className={`px-6 py-2.5 rounded-xl font-bold text-base transition cursor-pointer ${gameMode === 'learn' ? 'bg-yellow-400 text-slate-900 shadow-lg' : 'text-white hover:bg-white/10'}`}
        >
          🎙️ Voice & Learn
        </button>
        <button
          onClick={() => setGameMode('tap')}
          className={`px-6 py-2.5 rounded-xl font-bold text-base transition cursor-pointer ${gameMode === 'tap' ? 'bg-yellow-400 text-slate-900 shadow-lg' : 'text-white hover:bg-white/10'}`}
        >
          👆 Tap & Match
        </button>
      </div>

      {/* Main Content Card */}
      <main className="w-full max-w-md bg-white text-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center relative overflow-hidden my-auto">

        {praise && (
          <div className="absolute inset-0 bg-yellow-300/95 z-20 flex flex-col items-center justify-center animate-bounce">
            <Sparkles className="w-20 h-20 text-orange-500 mb-2" />
            <h2 className="text-4xl font-black text-slate-900">{praise}</h2>
          </div>
        )}

        {/* Letter Card Display Info */}
        <div className="w-full flex justify-between items-center mb-4 text-sm font-bold text-slate-400 uppercase tracking-wider">
          <span>Letter {currentIndex + 1} of {ALPHABET.length}</span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Score: {stars}</span>
        </div>

        <div
          onClick={() => speakText(`${currentItem.letter}. ${currentItem.word}`)}
          className="w-48 h-48 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-3xl shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition mb-6 border-4 border-amber-400"
        >
          <span className="text-7xl font-black text-slate-800">{currentItem.letter}</span>
          <span className="text-5xl mt-2">{currentItem.emoji}</span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-slate-700">
            {currentItem.letter} is for <span className="text-purple-600 underline decoration-yellow-400">{currentItem.word}</span>
          </h2>
          <button
            onClick={() => speakText(currentItem.letter)}
            className="mt-3 inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold text-base hover:bg-purple-200 transition cursor-pointer"
          >
            <Volume2 className="w-5 h-5" /> Hear Letter
          </button>
        </div>

        {/* Game Mode Controls */}
        {gameMode === 'learn' ? (
          <div className="w-full flex flex-col items-center gap-4">
            <button
              onClick={startListening}
              className={`w-full py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-lg transition active:scale-95 cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              {isListening ? `Listening for "${currentItem.letter}"...` : `Say "${currentItem.letter}" or "Say ${currentItem.letter}"`}
            </button>

            <div className="w-full bg-slate-100 p-3 rounded-xl text-center text-sm font-medium text-slate-600 min-h-[50px] flex items-center justify-center">
              {transcript ? `You said: "${transcript}"` : feedback}
            </div>

            {/* Parent Fallback Button */}
            <button
              onClick={handleSuccess}
              className="w-full py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" /> Parent Passed (No Mic)
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3">
            <p className="text-center font-bold text-slate-500 text-sm mb-1">Tap the correct matching picture!</p>
            <div className="grid grid-cols-3 gap-3 w-full">
              {tapOptions.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (option.letter === currentItem.letter) {
                      handleSuccess();
                    } else {
                      setFeedback("Oops! Try again!");
                      speakText("Try again");
                    }
                  }}
                  className="h-24 bg-slate-100 hover:bg-purple-100 border-2 border-slate-200 hover:border-purple-400 rounded-2xl flex flex-col items-center justify-center text-3xl transition hover:scale-105 shadow-md cursor-pointer"
                >
                  <span>{option.emoji}</span>
                  <span className="text-xs font-bold mt-1 text-slate-600">{option.letter}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Letter Picker Carousel */}
      <div className="w-full max-w-xl my-4 flex gap-2 overflow-x-auto py-2 px-2 shrink-0">
        {ALPHABET.map((item, index) => {
          const isUnlocked = index < unlockedLetters;
          const isCurrent = index === currentIndex;
          return (
            <button
              key={item.letter}
              disabled={!isUnlocked}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-12 h-12 rounded-2xl font-black text-base flex items-center justify-center transition shadow-md ${
                isCurrent
                  ? 'bg-yellow-400 text-slate-900 ring-4 ring-white scale-110'
                  : isUnlocked
                  ? 'bg-white/20 hover:bg-white/30 text-white cursor-pointer'
                  : 'bg-black/20 text-white/40 cursor-not-allowed'
              }`}
            >
              {item.letter}
            </button>
          );
        })}
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 max-w-md w-full rounded-3xl p-6 shadow-2xl relative">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2 text-purple-600">
              <HelpCircle className="w-7 h-7" /> Help & Mic Guide
            </h3>
            <ul className="space-y-3 text-sm font-medium text-slate-600 mb-6">
              <li>🎙️ **Voice Recognition:** You can say just the letter (e.g., "B") or use the helper phrase ("Say B") if your browser requires it.</li>
              <li>🛡️ **Parent Pass:** If your device doesn't support speech recognition or mic permissions are disabled, parents can click the **Parent Passed** button to progress!</li>
              <li>👆 **Tap Mode:** Switch to Tap Mode anytime to play without needing a microphone.</li>
            </ul>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold shadow-lg transition cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
