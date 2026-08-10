import { useEffect, useState } from "react";
import "./DidYouKnow.css";

const facts = [
  "🧠 Your brain uses about 20% of your body's total energy.",
  "🦈 Sharks existed before trees appeared on Earth.",
  "🌍 Antarctica is the world's largest desert.",
  "🪐 A day on Venus is longer than a year on Venus.",
  "🐙 Octopuses have three hearts and blue blood.",
  "🍌 Bananas are naturally slightly radioactive.",
  "🌊 Over 95% of Earth's oceans remain unexplored.",
  "🌙 The Moon moves about 3.8 cm away from Earth every year.",
  "⚡ Lightning is about five times hotter than the Sun's surface.",
  "❄️ Hot water can sometimes freeze faster than cold water.",

  "💻 The first computer bug was an actual moth.",
  "🌐 The world's first website is still online today.",
  "⌨️ The @ symbol existed long before email.",
  "💾 The first hard drive stored only 5 MB.",
  "📱 Your smartphone is millions of times more powerful than Apollo 11's computer.",
  "🤖 AI predicts words—it doesn't think like humans.",
  "🧠 Machine learning improves by finding patterns in data.",
  "📷 Computer vision allows AI to 'see' images.",
  "🎮 The first computer mouse was made of wood.",
  "🛰️ GPS only works because satellites account for Einstein's relativity.",

  "🤟 There are over 300 different sign languages worldwide.",
  "✋ ASL and BSL are completely different languages.",
  "😊 Facial expressions are an essential part of sign language.",
  "👶 Babies can learn signs before they can speak.",
  "🌍 Millions of people use sign language every day.",
  "🤝 Sign language has its own grammar and sentence structure.",
  "👀 Eye contact is important in sign language conversations.",
  "✍️ Fingerspelling is used for names and uncommon words.",
  "🎭 Body posture can completely change a sign's meaning.",
  "🌐 Every country may have its own sign language.",

  "🐧 Penguins propose with pebbles.",
  "🦒 Giraffes have the same number of neck bones as humans.",
  "🦋 Butterflies taste using their feet.",
  "🐘 Elephants can recognize themselves in a mirror.",
  "🦩 Flamingos are born gray, not pink.",
  "🐝 Honey never spoils.",
  "🐢 Some turtles can breathe through their backsides.",
  "🐸 Frogs don't drink water—they absorb it through their skin.",
  "🦉 Owls cannot move their eyes.",
  "🦑 Giant squids have eyes as large as basketballs.",

  "🚀 There are more stars than grains of sand on Earth.",
  "☀️ Light from the Sun takes about 8 minutes to reach Earth.",
  "🌌 Neutron stars can spin over 700 times every second.",
  "🌠 Saturn would float if there were a large enough ocean.",
  "🌎 Earth is the only known planet with liquid surface water.",
  "📚 Oxford University is older than the Aztec Empire.",
  "🏛️ Cleopatra lived closer to the Moon landing than to the Great Pyramid's construction.",
  "⏱️ The shortest recorded war lasted less than one hour.",
  "🎨 Blue was once one of the rarest colors in nature.",
  "🧬 Every human shares about 99.9% of their DNA with every other human."
];

export default function DidYouKnow() {

    const [index, setIndex] = useState(0);

    useEffect(() => {

        const timer = setInterval(() => {

            setIndex((prev) => (prev + 1) % facts.length);

        }, 10000);

        return () => clearInterval(timer);

    }, []);

    return (

        <div className="fact-card">

            <div className="fact-title">
                💡 Did You Know?
            </div>

            <div className="fact-text">
                {facts[index]}
            </div>

        </div>

    );

}