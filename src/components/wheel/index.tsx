// components/wheel/index.tsx

import React, { useEffect, useRef, useState } from 'react';
import Taro from '@tarojs/taro';
import { Canvas, View, Text } from '@tarojs/components';

interface WheelItem {
  text: string;
  color: string;
  resultText: string;
  weight: number;
}

interface WheelProps {
  items: WheelItem[];
  onResult: (item: WheelItem) => void;
}

const Wheel: React.FC<WheelProps> = ({ items, onResult }) => {
  const canvasRef = useRef<any>();
  const [rotating, setRotating] = useState(false);
  const [result, setResult] = useState<WheelItem | null>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    drawWheel();
  }, [items, rotation]);

  // Drawing functions
  const drawWheel = () => {
    const ctx = Taro.createCanvasContext('wheelCanvas');
    const canvasWidth = 300;
    const canvasHeight = 300;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw rotating wheel
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    drawWheelSegments(ctx, 0, 0, radius);
    ctx.restore();

    // Draw stationary elements
    drawCenterButtonWithPointer(ctx, centerX, centerY, radius);

    ctx.draw();
  };

  const drawWheelSegments = (ctx: any, centerX: number, centerY: number, radius: number) => {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let startAngle = 0;

    items.forEach((item) => {
      const sliceAngle = (2 * Math.PI * item.weight) / totalWeight;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = item.color;
      ctx.fill();

      drawSegmentText(ctx, item.text, centerX, centerY, radius, startAngle, sliceAngle);

      startAngle = endAngle;
    });
  };

  const drawSegmentText = (ctx: any, text: string, centerX: number, centerY: number, radius: number, startAngle: number, sliceAngle: number) => {
    ctx.save();
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, radius - 20, 0);
    ctx.restore();
  };

  const drawCenterButtonWithPointer = (ctx: any, centerX: number, centerY: number, radius: number) => {
    const buttonRadius = 40;
    const pointerSize = 10;

    // Create gradient for button
    const gradient = ctx.createLinearGradient(centerX - buttonRadius, centerY - buttonRadius, centerX + buttonRadius, centerY + buttonRadius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(1, 'rgba(240, 240, 240, 0.9)');

    // Draw button
    ctx.beginPath();
    ctx.arc(centerX, centerY, buttonRadius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw pointer (triangle) at the top of the button
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - buttonRadius - pointerSize);
    ctx.lineTo(centerX - pointerSize, centerY - buttonRadius);
    ctx.lineTo(centerX + pointerSize, centerY - buttonRadius);
    ctx.closePath();
    ctx.fillStyle = 'rgba(200, 200, 200, 0.9)';
    ctx.fill();

    // Draw text
    ctx.fillStyle = '#333333';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('开始', centerX, centerY);

    // Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, buttonRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  // Animation functions
  const startRotation = () => {
    if (rotating) return;

    setRotating(true);
    setResult(null);

    const totalRotation = 360 * 5 + Math.random() * 360; // 5 full rotations + random
    const duration = 5000; // 5 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentRotation = easeOutCubic(progress) * totalRotation;

      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setRotating(false);
        const winningAngle = totalRotation % 360;
        const winningItem = getWinningItem(winningAngle);
        setResult(winningItem);
        onResult(winningItem);
      }
    };

    requestAnimationFrame(animate);
  };

  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  // Utility functions
  const getWinningItem = (angle: number): WheelItem => {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let accumulatedAngle = 0;

    for (const item of items) {
      const itemAngle = (360 * item.weight) / totalWeight;
      if (angle >= accumulatedAngle && angle < accumulatedAngle + itemAngle) {
        return item;
      }
      accumulatedAngle += itemAngle;
    }

    return items[items.length - 1]; // Fallback to last item
  };

  return (
    <View>
      <Canvas
        canvasId='wheelCanvas'
        style='width: 300px; height: 300px;'
        onClick={startRotation}
        ref={canvasRef}
      />
      {result && (
        <View style='margin-top: 20px; text-align: center;'>
          <Text>结果: {result.resultText}</Text>
        </View>
      )}
    </View>
  );
};

export default Wheel;