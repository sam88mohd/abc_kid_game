import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Volume2, 
  Mic, 
  MicOff, 
  Sparkles, 
  Star, 
  Trophy, 
  Lock, 
  Unlock, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Award,
  Music,
  Smile,
  VolumeX,
  HelpCircle,
  CheckCircle,
  XCircle,
  ShieldAlert,
  UserCheck,
  Gamepad2,
  VolumeCheck,
  Sparkle
} from 'lucide-react';

// Alphabet dataset with phonics, target words, and colorful themes
const ALPHABET_DATA = [
  { letter: 'A', word: 'Apple', emoji: '🍎', color: 'from-red-400 to-pink-500', shadow: 'shadow-red-200', phonetic: 'ay', validPhrases: ['a', 'apple', 'letter a', 'ay'] },
  { letter: 'B', word: 'Ball', emoji: '🎈', color: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-200', phonetic: 'bee', validPhrases: ['b', 'ball', 'letter b', 'bee'] },
  { letter: 'C', word: 'Cat', emoji: '🐱', color: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-200', phonetic: 'cee', validPhrases: ['c', 'cat', 'letter c', 'see'] },
  { letter: 'D', word: 'Dog', emoji: '🐶', color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-200', phonetic: 'dee', validPhrases: ['d', 'dog', 'letter d', 'dee'] },
  { letter: 'E', word: 'Elephant', emoji: '🐘', color: 'from-purple-400 to-indigo-500', shadow: 'shadow-purple-200', phonetic: 'ee', validPhrases: ['e', 'elephant', 'letter e', 'ee'] },
  { letter: 'F', word: 'Fish', emoji: '🐟', color: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-200', phonetic: 'ef', validPhrases: ['f', 'fish', 'letter f', 'eff'] },
  { letter: 'G', word: 'Giraffe', emoji: '🦒', color: 'from-yellow-400 to-amber-500', shadow: 'shadow-yellow-200', phonetic: 'jee', validPhrases: ['g', 'giraffe', 'letter g', 'jee'] },
  { letter: 'H', word: 'Hat', emoji: '🎩', color: 'from-rose-400 to-red-500', shadow: 'shadow-rose-200', phonetic: 'aych', validPhrases: ['h', 'hat', 'letter h', 'aitch'] },
  { letter: 'I', word: 'Ice Cream', emoji: '🍦', color: 'from-sky-400 to-cyan-500', shadow: 'shadow-sky-200', phonetic: 'eye', validPhrases: ['i', 'ice cream', 'ice', 'letter i', 'eye'] },
  { letter: 'J', word: 'Juice', emoji: '🧃', color: 'from-orange-400 to-amber-500', shadow: 'shadow-orange-200', phonetic: 'jay', validPhrases: ['j', 'juice', 'letter j', 'jay'] },
  { letter: 'K', word: 'Kangaroo', emoji: '🦘', color: 'from-lime-400 to-emerald-500', shadow: 'shadow-lime-200', phonetic: 'kay', validPhrases: ['k', 'kangaroo', 'letter k', 'kay'] },
  { letter: 'L', word: 'Lion', emoji: '🦁', color: 'from-amber-400 to-yellow-600', shadow: 'shadow-amber-200', phonetic: 'el', validPhrases: ['l', 'lion', 'letter l', 'el'] },
  { letter: 'M', word: 'Monkey', emoji: '🐒', color: 'from-teal-400 to-emerald-600', shadow: 'shadow-teal-200', phonetic: 'em', validPhrases: ['m', 'monkey', 'letter m', 'em'] },
  { letter: 'N', word: 'Nest', emoji: '🪹', color: 'from-violet-400 to-purple-600', shadow: 'shadow-violet-200', phonetic: 'en', validPhrases: ['n', 'nest', 'letter n', 'en'] },
  { letter: 'O', word: 'Owl', emoji: '🦉', color: 'from-fuchsia-400 to-pink-600', shadow: 'shadow-fuchsia-200', phonetic: 'oh', validPhrases: ['o', 'owl', 'letter o', 'oh'] },
  { letter: 'P', word: 'Panda', emoji: '🐼', color: 'from-slate-400 to-zinc-600', shadow: 'shadow-slate-200', phonetic: 'pee', validPhrases: ['p', 'panda', 'letter p', 'pee'] },
  { letter: 'Q', word: 'Queen', emoji: '👑', color: 'from-yellow-300 to-amber-500', shadow: 'shadow-yellow-200', phonetic: 'cue', validPhrases: ['q', 'queen', 'letter q', 'cue'] },
  { letter: 'R', word: 'Rainbow', emoji: '🌈', color: 'from-indigo-400 to-purple-500', shadow: 'shadow-indigo-200', phonetic: 'ar', validPhrases: ['r', 'rainbow', 'letter r', 'are'] },
  { letter: 'S', word: 'Sun', emoji: '☀️', color: 'from-amber-300 to-orange-500', shadow: 'shadow-amber-200', phonetic: 'es', validPhrases: ['s', 'sun', 'letter s', 'ess'] },
  { letter: 'T', word: 'Tiger', emoji: '🐯', color: 'from-orange-400 to-red-500', shadow: 'shadow-orange-200', phonetic: 'tee', validPhrases: ['t', 'tiger', 'letter t', 'tee'] },
  { letter: 'U', word: 'Umbrella', emoji: '☂️', color: 'from-blue-400 to-cyan-500', shadow: 'shadow-blue-200', phonetic: 'you', validPhrases: ['u', 'umbrella', 'letter u', 'you'] },
  { letter: 'V', word: 'Violin', emoji: '🎻', color: 'from-purple-400 to-violet-600', shadow: 'shadow-purple-200', phonetic: 'vee', validPhrases: ['v', 'violin', 'letter v', 'vee'] },
  { letter: 'W', word: 'Watermelon', emoji: '🍉', color: 'from-pink-400 to-rose-500', shadow: 'shadow-pink-200', phonetic: 'double you', validPhrases: ['w', 'watermelon', 'letter w', 'double you'] },
  { letter: 'X', word: 'Xylophone', emoji: '🎼', color: 'from-teal-400 to-cyan-600', shadow: 'shadow-teal-200', phonetic: 'ex', validPhrases: ['x', 'xylophone', 'letter x', 'eks'] },
  { letter: 'Y', word: 'Yo-Yo', emoji: '🪀', color: 'from-lime-400 to-green-500', shadow: 'shadow-lime-200', phonetic: 'why', validPhrases: ['y', 'yo-yo', 'yoyo', 'letter y', 'why'] },
  { letter: 'Z', word: 'Zebra', emoji: '🦓', color: 'from-gray-400 to-slate-700', shadow: 'shadow-gray-200', phonetic: 'zee', validPhrases: ['z', 'zebra', 'letter z', 'zee', 'zed'] }
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [mode, setMode] = useState('learn'); // 'learn' or 'free'
  const [practiceMethod, setPracticeMethod] = useState('mic'); // 'mic' or 'tap'
  const [isListening, setIsListening] = useState(false);
  const [speechResult, setSpeechResult] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [stars, setStars] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [micState, setMicState] = useState('unknown'); // 'unknown', 'granted', 'denied', 'error'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMicGuide, setShowMicGuide] = useState(false);
  const [tapGameOptions, setTapGameOptions] = useState([]);

  const recognitionRef = useRef(null);
  const currentLetterData = ALPHABET_DATA[currentIndex];

  // Initialize Speech Recognition & check permissions
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setPracticeMethod('tap');
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechResult('Listening...');
        setFeedback({ type: '', text: '' });
        setMicState('granted');
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((res) => res[0].transcript)
          .join('')
          .toLowerCase();

        setSpeechResult(transcript);

        if (event.results[0].isFinal) {
          verifySpeech(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicState('denied');
          setPracticeMethod('tap');
          setFeedback({
            type: 'error',
            text: 'Microphone permission denied! Switch to Tap & Verify mode or enable mic in settings.'
          });
        } else if (event.error === 'no-speech') {
          setFeedback({ type: 'error', text: 'No speech detected. Try speaking closer to the mic!' });
        } else {
          setFeedback({ type: 'error', text: 'Mic error. Try tapping the Parent Pass button or Tap Challenge!' });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    // Load saved progress
    const savedUnlocked = localStorage.getItem('abc_unlocked');
    const savedStars = localStorage.getItem('abc_stars');
    if (savedUnlocked) setUnlockedIndex(parseInt(savedUnlocked, 10));
    if (savedStars) setStars(parseInt(savedStars, 10));
  }, []);

  // Generate randomized choices for Tap & Match Mode whenever current letter changes
  useEffect(() => {
    generateTapOptions();
    setSpeechResult('');
    setFeedback({ type: '', text: '' });
  }, [currentIndex]);

  // Save progress
  useEffect(() => {
    localStorage.setItem('abc_unlocked', unlockedIndex.toString());
    localStorage.setItem('abc_stars', stars.toString());
  }, [unlockedIndex, stars]);

  // Speech synthesis helper
  const speakText = (text, rate = 0.9) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const playGuide = () => {
    const textToSpeak = `${currentLetterData.letter}... is for ${currentLetterData.word}`;
    speakText(textToSpeak);
  };

  // Generate 4 randomized options for the interactive tap game
  const generateTapOptions = () => {
    const correctOption = { letter: currentLetterData.letter, word: currentLetterData.word, emoji: currentLetterData.emoji, isCorrect: true };
    const otherLetters = ALPHABET_DATA.filter((item) => item.letter !== currentLetterData.letter);
    
    // Shuffle and slice 3 distractors
    const shuffledDistractors = [...otherLetters].sort(() => 0.5 - Math.random()).slice(0, 3);
    const distractorOptions = shuffledDistractors.map(item => ({
      letter: item.letter,
      word: item.word,
      emoji: item.emoji,
      isCorrect: false
    }));

    const options = [correctOption, ...distractorOptions].sort(() => 0.5 - Math.random());
    setTapGameOptions(options);
  };

  // Handle Voice Recording Start/Stop
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setFeedback({ type: 'error', text: 'Microphone recognition is unavailable on this device.' });
      setPracticeMethod('tap');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        window.speechSynthesis.cancel();
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start recognition:', err);
      }
    }
  };

  // Check spoken speech
  const verifySpeech = (input) => {
    const cleanInput = input.trim().toLowerCase();
    const valid = currentLetterData.validPhrases;

    const isCorrect = valid.some((phrase) => cleanInput.includes(phrase)) || 
                      cleanInput.startsWith(currentLetterData.letter.toLowerCase());

    if (isCorrect) {
      handleSuccess("Great speech! Correct pronunciation!");
    } else {
      handleFailure(input);
    }
  };

  // Handle Tap Practice Selection
  const handleTapChoice = (option) => {
    if (option.isCorrect) {
      handleSuccess(`Correct! '${option.letter}' is for ${option.word}!`);
    } else {
      setFeedback({
        type: 'error',
        text: `Oops! That's ${option.letter} (${option.word}). Find Letter ${currentLetterData.letter}!`
      });
      speakText(`Try again! Find letter ${currentLetterData.letter}`);
    }
  };

  // Parent Manual Pass Action
  const handleParentPass = () => {
    handleSuccess(`Parent Verified! Good job pronouncing ${currentLetterData.letter}!`);
  };

  // Universal Success Handler
  const handleSuccess = (customPraise) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setFeedback({
      type: 'success',
      text: customPraise || `Awesome! That's ${currentLetterData.letter}!`
    });

    speakText(customPraise || `Great job! You got ${currentLetterData.letter}!`);

    setStars((prev) => prev + 1);

    if (mode === 'learn' && currentIndex === unlockedIndex && unlockedIndex < ALPHABET_DATA.length - 1) {
      const nextIndex = unlockedIndex + 1;
      setUnlockedIndex(nextIndex);
    }
  };

  const handleFailure = (spokenText) => {
    const encouragingPhrases = [
      `Almost! Try saying '${currentLetterData.letter}' or '${currentLetterData.word}' clearly!`,
      `You said "${spokenText}". Click "Parent Pass" if it was close!`,
      `Good try! Click 'Hear Sound' to listen again!`
    ];
    const phrase = encouragingPhrases[Math.floor(Math.random() * encouragingPhrases.length)];

    setFeedback({
      type: 'error',
      text: phrase
    });

    speakText(`Almost! Try saying ${currentLetterData.letter} for ${currentLetterData.word}`);
  };

  const nextLetter = () => {
    if (currentIndex < ALPHABET_DATA.length - 1) {
      if (mode === 'learn' && currentIndex + 1 > unlockedIndex) return;
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevLetter = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const selectLetter = (index) => {
    if (mode === 'learn' && index > unlockedIndex) return;
    setCurrentIndex(index);
  };

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset stars and progress?")) {
      setUnlockedIndex(0);
      setCurrentIndex(0);
      setStars(0);
      localStorage.clear();
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 font-sans text-slate-800 flex flex-col justify-between selection:bg-pink-200 selection:text-pink-800">
      
      {/* Top Header Navigation */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b border-amber-200/60 shadow-sm px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-yellow-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-md transform -rotate-3">
              ABC
            </div>
            <div>
              <h1 className="font-black text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent leading-none">
                Phonics Kingdom
              </h1>
              <p className="text-xs font-semibold text-amber-600">Pronounce or Tap to Unlock!</p>
            </div>
          </div>

          {/* Mode Switcher & Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Mode Switcher */}
            <div className="bg-amber-100 p-1 rounded-full flex items-center border border-amber-200">
              <button
                onClick={() => setMode('learn')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                  mode === 'learn'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                    : 'text-amber-800'
                }`}
              >
                <Trophy size={13} /> Learn Mode
              </button>
              <button
                onClick={() => setMode('free')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                  mode === 'free'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm'
                    : 'text-amber-800'
                }`}
              >
                <Sparkles size={13} /> Free Play
              </button>
            </div>

            {/* Stars Counter */}
            <div className="bg-yellow-100 border border-yellow-300 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-500 animate-bounce" />
              <span className="font-extrabold text-amber-900 text-xs sm:text-sm">{stars}</span>
            </div>

            {/* Help / Mic Guide Toggle */}
            <button
              onClick={() => setShowMicGuide(!showMicGuide)}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title="Mic Troubleshooting & Permissions"
            >
              <HelpCircle size={18} />
            </button>

            {/* Mute Button */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title={soundEnabled ? "Mute Sound" : "Enable Sound"}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-5 w-full flex-grow flex flex-col items-center justify-center">
        
        {/* Permission Denied / Fallback Alert Banner */}
        {micState === 'denied' && (
          <div className="w-full max-w-md mb-4 bg-amber-50 border-2 border-amber-300 text-amber-900 p-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>Mic access is turned off. You can use <b>Tap Challenge</b> or <b>Parent Pass</b>!</span>
            </div>
            <button
              onClick={() => setShowMicGuide(true)}
              className="bg-amber-200 hover:bg-amber-300 text-amber-900 px-2.5 py-1 rounded-lg font-bold text-xs flex-shrink-0"
            >
              Fix Mic
            </button>
          </div>
        )}

        {/* Practice Mode Toggle Bar */}
        <div className="w-full max-w-md bg-white border border-amber-200 p-1.5 rounded-2xl mb-4 flex items-center justify-center gap-1 shadow-sm">
          <button
            onClick={() => setPracticeMethod('mic')}
            disabled={!speechSupported || micState === 'denied'}
            className={`flex-1 py-1.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition ${
              practiceMethod === 'mic'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            <Mic size={14} /> Voice Practice
          </button>

          <button
            onClick={() => setPracticeMethod('tap')}
            className={`flex-1 py-1.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition ${
              practiceMethod === 'tap'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Gamepad2 size={14} /> Tap & Match Challenge
          </button>
        </div>

        {/* Main Card */}
        <div className="w-full relative flex flex-col items-center">
          <div className={`w-full max-w-md rounded-3xl p-6 bg-gradient-to-b ${currentLetterData.color} text-white shadow-2xl ${currentLetterData.shadow} transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-between border-4 border-white/40`}>
            
            {/* Top Bar inside Card */}
            <div className="w-full flex justify-between items-center z-10">
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                Letter {currentIndex + 1} / 26
              </span>
              
              <button
                onClick={playGuide}
                className="bg-white/30 hover:bg-white/40 active:scale-95 text-white p-2 rounded-full backdrop-blur-md transition flex items-center gap-1 text-xs font-bold"
              >
                <Volume2 size={16} /> Hear Sound
              </button>
            </div>

            {/* Letter Display */}
            <div className="my-1 text-center z-10">
              <h2 className="text-8xl sm:text-9xl font-black drop-shadow-lg tracking-tight select-none">
                {currentLetterData.letter}
              </h2>
            </div>

            {/* Emoji & Word */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3.5 w-full text-center z-10 flex flex-col items-center gap-0.5 border border-white/30 shadow-inner">
              <span className="text-5xl sm:text-6xl transform transition hover:scale-110 duration-200 drop-shadow">
                {currentLetterData.emoji}
              </span>
              <p className="text-2xl font-extrabold tracking-wide drop-shadow-sm">
                {currentLetterData.word}
              </p>
              <span className="text-xs font-medium text-white/80 italic">
                Phonic: "{currentLetterData.phonetic}"
              </span>
            </div>

            {/* INTERACTIVE PRACTICE AREA */}
            <div className="mt-5 z-10 flex flex-col items-center w-full">
              
              {/* MODE 1: Voice Recognition Mode */}
              {practiceMethod === 'mic' && (
                <div className="flex flex-col items-center w-full">
                  <button
                    onClick={toggleListening}
                    className={`relative p-5 rounded-full transition-all transform active:scale-95 shadow-xl flex items-center justify-center ${
                      isListening
                        ? 'bg-rose-500 ring-8 ring-rose-300/60 animate-pulse'
                        : 'bg-white text-slate-800 hover:bg-amber-100 hover:scale-105'
                    }`}
                  >
                    <Mic className="w-9 h-9 text-pink-600" />
                  </button>
                  <span className="mt-2 text-xs font-extrabold text-white/90 drop-shadow">
                    {isListening ? 'Listening... Speak clearly!' : 'Tap Mic & Say the Word'}
                  </span>
                </div>
              )}

              {/* MODE 2: Tap & Match Game Mode (No Mic Needed) */}
              {practiceMethod === 'tap' && (
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs font-bold text-white/90 mb-2">Tap the matching letter & image!</span>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {tapGameOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleTapChoice(opt)}
                        className="bg-white/90 hover:bg-white text-slate-800 p-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition active:scale-95 border border-white"
                      >
                        <span className="text-xl">{opt.emoji}</span>
                        <div className="text-left leading-tight">
                          <div className="font-black text-pink-600 text-base">{opt.letter}</div>
                          <div className="text-xs font-semibold text-slate-600">{opt.word}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PARENT PASS OPTION */}
              <div className="mt-4 pt-3 border-t border-white/20 w-full flex justify-center">
                <button
                  onClick={handleParentPass}
                  className="bg-amber-400/90 hover:bg-amber-300 text-amber-950 px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-md border border-yellow-200 transition active:scale-95"
                >
                  <UserCheck size={14} /> Parent Passed (Skip / Verify)
                </button>
              </div>

            </div>

          </div>

          {/* Feedback Display */}
          <div className="w-full max-w-md mt-3 flex flex-col items-center min-h-[50px]">
            {speechResult && practiceMethod === 'mic' && (
              <div className="text-xs font-semibold text-slate-500 mb-1">
                You said: <span className="font-bold text-slate-700">"{speechResult}"</span>
              </div>
            )}

            {feedback.text && (
              <div className={`w-full p-3 rounded-2xl font-bold text-center text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-800'
                  : 'bg-amber-100 border-2 border-amber-400 text-amber-900'
              }`}>
                {feedback.type === 'success' ? <Award className="w-4 h-4 text-emerald-600" /> : <Smile className="w-4 h-4 text-amber-600" />}
                <span>{feedback.text}</span>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="w-full max-w-md flex justify-between items-center mt-1">
            <button
              onClick={prevLetter}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl font-bold text-xs transition shadow-sm ${
                currentIndex === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-white hover:bg-amber-100 text-slate-700 border border-slate-200'
              }`}
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <button
              onClick={nextLetter}
              disabled={
                currentIndex === ALPHABET_DATA.length - 1 ||
                (mode === 'learn' && currentIndex + 1 > unlockedIndex)
              }
              className={`flex items-center gap-1 px-4 py-2 rounded-xl font-bold text-xs transition shadow-sm ${
                currentIndex === ALPHABET_DATA.length - 1 || (mode === 'learn' && currentIndex + 1 > unlockedIndex)
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
              }`}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>

        </div>

        {/* Alphabet Map Grid */}
        <div className="w-full max-w-xl mt-8 bg-white rounded-3xl p-4 border border-amber-200 shadow-xl">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
              <Music className="w-4 h-4 text-pink-500" />
              Alphabet Map
            </h3>
            <span className="text-xs font-extrabold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
              {mode === 'learn' ? `Unlocked: ${unlockedIndex + 1}/26` : 'Free Play'}
            </span>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
            {ALPHABET_DATA.map((item, idx) => {
              const isCurrent = idx === currentIndex;
              const isLocked = mode === 'learn' && idx > unlockedIndex;
              const isCompleted = idx < unlockedIndex;

              return (
                <button
                  key={item.letter}
                  onClick={() => selectLetter(idx)}
                  disabled={isLocked}
                  className={`aspect-square rounded-xl font-black text-sm sm:text-base flex items-center justify-center relative transition ${
                    isCurrent
                      ? 'ring-2 ring-pink-400 bg-gradient-to-br from-pink-500 to-rose-500 text-white scale-105 shadow'
                      : isLocked
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      : 'bg-amber-50 hover:bg-amber-100 text-slate-700 border border-amber-200'
                  }`}
                >
                  {item.letter}
                  {isLocked && <Lock size={9} className="absolute bottom-1 right-1 text-slate-300" />}
                  {isCompleted && !isCurrent && <Star size={9} className="absolute top-1 right-1 fill-yellow-400 text-yellow-500" />}
                </button>
              );
            })}
          </div>
        </div>

      </main>

      {/* Mic Permission Guide Modal */}
      {showMicGuide && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 relative animate-fade-in">
            <button
              onClick={() => setShowMicGuide(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <XCircle size={22} />
            </button>

            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-3">
              <Mic className="text-pink-500" /> How to Enable Microphone Access
            </h3>

            <p className="text-xs text-slate-600 mb-4">
              If your microphone is blocked or not working, follow these quick steps depending on your browser:
            </p>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-extrabold text-pink-600 block mb-1">🌐 Chrome / Android / WebViews:</span>
                1. Tap the <b>lock / tune icon</b> next to the website URL at the top.<br />
                2. Tap <b>Permissions</b> or <b>Site Settings</b>.<br />
                3. Switch <b>Microphone</b> to <b>Allow</b> and reload the page.
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-extrabold text-purple-600 block mb-1">📱 Safari / iOS iPhone / iPad:</span>
                1. Tap the <b>'aA' icon</b> on the left side of the Safari address bar.<br />
                2. Select <b>Website Settings</b>.<br />
                3. Set <b>Microphone</b> to <b>Allow</b>.
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900">
                <span className="font-extrabold block mb-1">💡 No Mic? No Problem!</span>
                You can switch to <b>Tap & Match Challenge</b> or use the <b>Parent Passed</b> button to unlock letters anytime!
              </div>
            </div>

            <button
              onClick={() => setShowMicGuide(false)}
              className="mt-5 w-full bg-pink-500 hover:bg-pink-600 text-white font-black py-2.5 rounded-2xl text-xs transition"
            >
              Got It! Back to Game
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-3 text-center text-xs font-semibold text-slate-400 border-t border-amber-200/50 bg-white/50">
        <div className="max-w-md mx-auto flex justify-between items-center px-4">
          <span>ABC Kids Pronunciation Adventure</span>
          <button onClick={resetProgress} className="hover:text-red-500 flex items-center gap-1 transition">
            <RotateCcw size={11} /> Reset Progress
          </button>
        </div>
      </footer>

    </div>
  );
}