import { useEffect, useState } from 'react';

export const usePageAnimation = (options: {
    steps?: number;
    delay?: number;
    initialDelay?: number;
} = {}) => {
    const {
        steps = 3,
        delay = 50,
        initialDelay = 100
    } = options;

    const [animationStep, setAnimationStep] = useState(0);

    useEffect(() => {
        // Type correct pour setTimeout
        const timers: ReturnType<typeof setTimeout>[] = [];

        for (let i = 1; i <= steps; i++) {
            const timer = setTimeout(() => {
                setAnimationStep(i);
            }, initialDelay + (i * delay));

            timers.push(timer);
        }

        // Cleanup
        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [steps, delay, initialDelay]);

    const getStepClass = (step: number): string => {
        return animationStep >= step ? 'visible' : '';
    };

    return {
        animationStep,
        getStepClass,
        resetAnimation: () => setAnimationStep(0)
    };
};