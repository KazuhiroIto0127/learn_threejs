import { gsap } from 'gsap';

// OBAKE テキストアニメーションの設定
export const setupOBAKEAnimation = () => {
    const obakeText = document.getElementById('obake-text');
    const container = document.getElementById('obake-text-container');

    if (obakeText && container) {
        // テキストの幅を取得
        const textWidth = obakeText.scrollWidth;
        const containerWidth = container.offsetWidth;

        // 初期位置を右端の外側に設定
        gsap.set(obakeText, { x: containerWidth });

        // 無限ループアニメーション
        gsap.to(obakeText, {
            x: -textWidth,
            duration: 15,
            ease: "none",
            repeat: -1,
            onComplete: () => {
                // アニメーション完了時に右端に戻す
                gsap.set(obakeText, { x: containerWidth });
            }
        });

        // 背景グラデーションのアニメーション
        gsap.to(obakeText, {
            backgroundPosition: "200% 200%",
            duration: 3,
            ease: "none",
            repeat: -1,
            yoyo: true
        });

        // 微細な上下の動き
        gsap.to(obakeText, {
            y: "+=5",
            duration: 2,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true
        });

        // 透明度の変化でゴーストらしい効果
        gsap.to(obakeText, {
            opacity: 0.6,
            duration: 1.5,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true
        });
    }
};

// アニメーションの初期化
export const initializeAnimations = () => {
    // DOMが読み込まれた後にアニメーションを開始
    const startAnimations = () => {
        setupOBAKEAnimation();
    };

    // すでにDOMが読み込まれている場合は即座に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startAnimations);
    } else {
        startAnimations();
    }
};
