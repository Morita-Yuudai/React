'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// @ts-ignore
import { VRMLoaderPlugin } from '@pixiv/three-vrm';

export default function TestPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const vrmRef = useRef<any>(null);

  // 画面サイズの設定
  // - 必要に応じてサイズを変更可能
  // - アスペクト比は4:3を推奨
  const SCREEN_WIDTH = 800;   // 画面の幅
  const SCREEN_HEIGHT = 600;  // 画面の高さ

  useEffect(() => {
    if (!containerRef.current) return;

    // レンダラーの設定
    // - antialias: エッジのギザギザを滑らかにする（true推奨）
    // - alpha: 背景の透過を有効にする
    // - preserveDrawingBuffer: 画面キャプチャを可能にする
    // - precision: 描画の精度（highp = より高品質な描画）
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      precision: 'highp',
    });
    
    // レンダラーの詳細設定
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    // デバイスのピクセル比を設定（Retinaディスプレイなどで綺麗に表示）
    renderer.setPixelRatio(window.devicePixelRatio);
    // 出力カラースペースの設定（より正確な色表現）
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // トーンマッピングの設定（HDR→LDRの変換方法）
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // シャドウマップの有効化（影の表示）
    renderer.shadowMap.enabled = true;
    // シャドウマップのタイプ（ソフトシャドウ）
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);

    // シーンの設定
    // - background: 背景色（0xf0f0f0 = 明るいグレー）
    // - 必要に応じて背景色を変更可能
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // 環境光の設定
    // - 色: 0xffffff（白色光）
    // - 強度: 3.0（値を大きくすると明るく、小さくすると暗くなる）
    const light = new THREE.AmbientLight(0xffffff, 3);
    scene.add(light);

    // カメラの設定
    // - 視野角: 35度（小さくすると望遠、大きくすると広角）
    // - アスペクト比: 画面のwidth/height
    // - near: 0.1（これより近いものは表示されない）
    // - far: 20.0（これより遠いものは表示されない）
    const camera = new THREE.PerspectiveCamera(
      35,
      SCREEN_WIDTH / SCREEN_HEIGHT,
      0.1,
      20.0
    );
    // カメラの位置と注視点
    // position.set(x, y, z)
    // - x: 横方向の位置（0 = 中央）
    // - y: 縦方向の位置（1.2 = モデルの顔の高さ程度）
    // - z: 前後の位置（-2 = モデルの2単位後ろ）
    camera.position.set(0, 1.2, -2);
    camera.lookAt(0, 1.2, 0);

    // VRMモデルのローディング設定
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    // アニメーションの基準となる時間
    let time = 0;

    // アニメーションループ
    const animate = () => {
      requestAnimationFrame(animate);
      // 時間の更新（値を大きくすると動きが速くなる）
      time += 0.01;

      // VRMモデルのアニメーション処理
      if (vrmRef.current) {
        const vrm = vrmRef.current;

        // 待機モーション（上下の揺れ）
        // - 基準位置: -0.2
        // - 揺れの速さ: time * 1.5（大きくすると速く揺れる）
        // - 揺れの幅: 0.001（大きくすると大きく揺れる）
        vrm.scene.position.y = -0.2 + Math.sin(time * 1.5) * 0.001;
        
        // 体の回転（左右の揺れ）
        // - 揺れの速さ: time * 0.5（大きくすると速く揺れる）
        // - 揺れの幅: 0.01（大きくすると大きく揺れる）
        vrm.scene.rotation.y = Math.sin(time * 0.5) * 0.01;

        // 瞬き処理
        // - 発生確率: 0.001（大きくすると頻繁に瞬きする）
        // - 瞬きの長さ: setTimeout 50ms（まぶたを閉じている時間）
        if (vrm.expressionManager && Math.random() < 0.0015) {
          const blink = async () => {
            // まぶたを閉じる
            vrm.expressionManager.setValue('blinkLeft', 1.0);
            vrm.expressionManager.setValue('blinkRight', 1.0);
            vrm.expressionManager.update();

            await new Promise(resolve => setTimeout(resolve, 50));

            // まぶたを開く（徐々に開く処理）
            // - 開く速さ: 5ms間隔で0.1ずつ減少
            for (let i = 1.0; i >= 0; i -= 0.1) {
              vrm.expressionManager.setValue('blinkLeft', i);
              vrm.expressionManager.setValue('blinkRight', i);
              vrm.expressionManager.update();
              await new Promise(resolve => setTimeout(resolve, 5));
            }
          };
          blink();
        }
      }

      renderer.render(scene, camera);
    };

    // VRMモデルのロード
    loader.load(
      '/models/test.vrm', // モデルのパス（public/models/内に配置）
      (gltf) => {
        const vrm = gltf.userData.vrm;
        vrmRef.current = vrm;
        scene.add(vrm.scene);

        // モデルのサイズ調整
        // - targetHeight: 目標の表示高さ（1.5 = 標準的な人物の高さ）
        const bbox = new THREE.Box3().setFromObject(vrm.scene);
        const modelHeight = bbox.max.y - bbox.min.y;
        const targetHeight = 1.5;
        const scale = targetHeight / modelHeight;
        vrm.scene.scale.set(scale, scale, scale);
        
        // モデルの位置調整（足が地面に着くように）
        const offset = -bbox.min.y * scale;
        vrm.scene.position.y = offset;

        // ポーズの設定
        if (vrm.humanoid) {
          // 右腕の設定
          const rightUpperArm = vrm.humanoid.getRawBoneNode('rightUpperArm');
          const rightLowerArm = vrm.humanoid.getRawBoneNode('rightLowerArm');
          if (rightUpperArm && rightLowerArm) {
            // 上腕の回転
            // - rotation.z: 腕の開き具合（負の値で外側に開く）
            // - rotation.x: 腕の前後の傾き（正の値で前に出る）
            rightUpperArm.rotation.z = -1.2;
            rightUpperArm.rotation.x = 0.1;
            // 肘の回転
            // - rotation.x: 肘の曲がり具合（正の値で曲がる）
            rightLowerArm.rotation.x = 0.1;
          }

          // 左腕の設定（右腕と対称的な値を設定）
          const leftUpperArm = vrm.humanoid.getRawBoneNode('leftUpperArm');
          const leftLowerArm = vrm.humanoid.getRawBoneNode('leftLowerArm');
          if (leftUpperArm && leftLowerArm) {
            leftUpperArm.rotation.z = 1.2;
            leftUpperArm.rotation.x = 0.1;
            leftLowerArm.rotation.x = 0.5;
          }

          // 右足の設定
          const rightUpperLeg = vrm.humanoid.getRawBoneNode('rightUpperLeg');
          if (rightUpperLeg) {
            // rotation.z: 足の開き具合
            // rotation.y: 足の向き（つま先の向き）
            rightUpperLeg.rotation.z = 0;
            rightUpperLeg.rotation.y = 0.1;
          }

          // 左足の設定（右足と対称的な値を設定）
          const leftUpperLeg = vrm.humanoid.getRawBoneNode('leftUpperLeg');
          if (leftUpperLeg) {
            leftUpperLeg.rotation.z = -0;
            leftUpperLeg.rotation.y = -0.1;
          }
        }

        animate();
      },
      undefined,
      (error) => console.error('VRMロードエラー:', error)
    );

    // クリーンアップ処理
    return () => {
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div 
        ref={containerRef} 
        className={`w-[${SCREEN_WIDTH}px] h-[${SCREEN_HEIGHT}px]`}
      />
    </div>
  );
}
