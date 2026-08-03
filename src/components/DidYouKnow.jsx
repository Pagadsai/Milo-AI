import { useEffect, useState } from "react";
import "./DidYouKnow.css";

const facts = [

    // Programming
    "The first computer bug was an actual moth found inside a computer in 1947.",
    "JavaScript was created in just 10 days.",
    "Python is named after Monty Python, not the snake.",
    "React was created by Facebook in 2013.",
    "The first website is still online today.",

    // AI
    "Artificial Intelligence can recognize images faster than humans in some tasks.",
    "Machine Learning allows computers to learn from data.",
    "Large Language Models predict the next word one token at a time.",
    "Computer Vision helps computers understand images.",
    "Generative AI can create text, images and music.",

    // Space
    "One day on Venus is longer than one year on Venus.",
    "The Sun contains over 99% of the Solar System's mass.",
    "Neutron stars are incredibly dense.",
    "Jupiter has more than 90 known moons.",
    "Light from the Sun takes about 8 minutes to reach Earth.",

    // Science
    "Water expands when it freezes.",
    "Lightning is hotter than the surface of the Sun.",
    "Your body contains trillions of cells.",
    "Sound travels faster in water than air.",
    "Humans share about 60% of their DNA with bananas.",

    // Mathematics
    "Zero was invented in India.",
    "Pi never ends.",
    "A prime number has exactly two factors.",
    "Infinity is not a number.",
    "The Fibonacci sequence appears in nature.",

    // Geography
    "Russia is the largest country in the world.",
    "Africa has 54 countries.",
    "The Pacific Ocean is the largest ocean.",
    "Mount Everest is Earth's tallest mountain above sea level.",
    "The Sahara is the largest hot desert.",

    // History
    "The Great Wall of China isn't visible from space with the naked eye.",
    "Paper was invented in China.",
    "The printing press changed the world.",
    "The wheel was invented over 5000 years ago.",
    "The Internet became public in the 1990s.",

    // Animals
    "Octopuses have three hearts.",
    "A group of flamingos is called a flamboyance.",
    "Cheetahs are the fastest land animals.",
    "Elephants cannot jump.",
    "Honey never spoils.",

    // Technology
    "The first email was sent in 1971.",
    "Over 90% of the world's data has been created in recent years.",
    "Cloud computing doesn't actually store data in the clouds.",
    "USB stands for Universal Serial Bus.",
    "The QWERTY keyboard was designed to prevent jams.",

    // Random
    "Chess has more possible games than atoms in the observable universe.",
    "The human brain has around 86 billion neurons.",
    "Bamboo grows faster than most plants.",
    "Butterflies taste with their feet.",
    "A day on Mercury lasts 176 Earth days."

];

export default function DidYouKnow() {

    const [index, setIndex] = useState(0);

    useEffect(() => {

        const timer = setInterval(() => {

            setIndex((prev) => (prev + 1) % facts.length);

        }, 15000);

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