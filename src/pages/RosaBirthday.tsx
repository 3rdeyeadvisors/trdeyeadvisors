import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Auto-shutdown after 10 hours (in milliseconds)
const SHUTDOWN_DURATION = 10 * 60 * 60 * 1000;

// Birthday messages that rotate
const birthdayMessages = [
  "Gracias por tu luz, Rosa. Hoy celebramos todo lo que eres. 💛",
  "Que este nuevo año te traiga salud, amor y abundancia.",
  "Tu dedicación hace más fuerte a Hotel Emma. Emma Strong.",
  "Gracias por hacerlo todo con corazón. The Finance Team Rocks.",
  "Eres una bendición para todos nosotros. ¡Felicidades!"
];

// Firework particle class
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  decay: number;
  size: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.color = color;
    this.decay = Math.random() * 0.015 + 0.005;
    this.size = Math.random() * 3 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05; // gravity
    this.alpha -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Firework class
class Firework {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  exploded: boolean;
  particles: Particle[];
  color: string;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = canvasHeight;
    this.targetY = Math.random() * (canvasHeight * 0.5) + canvasHeight * 0.1;
    this.speed = Math.random() * 3 + 4;
    this.exploded = false;
    this.particles = [];
    // Mexican flag colors + gold/festive colors
    const colors = ['#006847', '#FFFFFF', '#CE1126', '#FFD700', '#FF6B6B', '#4ECDC4', '#FFE66D'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    if (!this.exploded) {
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        this.explode();
      }
    } else {
      this.particles.forEach(p => p.update());
      this.particles = this.particles.filter(p => p.alpha > 0);
    }
  }

  explode() {
    this.exploded = true;
    const particleCount = Math.floor(Math.random() * 50) + 50;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.x, this.y, this.color));
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.exploded) {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      this.particles.forEach(p => p.draw(ctx));
    }
  }

  isDead() {
    return this.exploded && this.particles.length === 0;
  }
}

const RosaBirthday = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const fireworksRef = useRef<Firework[]>([]);
  const animationRef = useRef<number>();

  // Check if page should be expired
  useEffect(() => {
    const startTime = localStorage.getItem('rosa-birthday-start');
    const now = Date.now();
    
    if (!startTime) {
      localStorage.setItem('rosa-birthday-start', now.toString());
    } else {
      const elapsed = now - parseInt(startTime);
      if (elapsed >= SHUTDOWN_DURATION) {
        setIsExpired(true);
        return;
      }
    }

    // Set timeout for remaining time
    const remainingTime = startTime 
      ? SHUTDOWN_DURATION - (now - parseInt(startTime))
      : SHUTDOWN_DURATION;

    const timeout = setTimeout(() => {
      setIsExpired(true);
    }, remainingTime);

    return () => clearTimeout(timeout);
  }, []);

  // Rotate birthday messages
  useEffect(() => {
    if (isExpired) return;
    
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % birthdayMessages.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isExpired]);

  // Fireworks animation
  useEffect(() => {
    if (isExpired) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastFireworkTime = 0;
    const fireworkInterval = 800; // New firework every 800ms

    const animate = (timestamp: number) => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add new fireworks
      if (timestamp - lastFireworkTime > fireworkInterval) {
        fireworksRef.current.push(new Firework(canvas.width, canvas.height));
        lastFireworkTime = timestamp;
      }

      // Update and draw fireworks
      fireworksRef.current.forEach(fw => {
        fw.update();
        fw.draw(ctx);
      });

      // Remove dead fireworks
      fireworksRef.current = fireworksRef.current.filter(fw => !fw.isDead());

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isExpired]);

  // Show expired state
  if (isExpired) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <p className="text-2xl">Esta celebración ha terminado.</p>
          <p className="mt-2">Gracias por celebrar con Rosa. 🎉</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900">
      {/* Fireworks Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}
      />

      {/* Mexican Flag - Top Right */}
      <div className="absolute top-8 right-8 z-10 flex items-center gap-2 opacity-90">
        <div className="flex shadow-2xl rounded overflow-hidden">
          <div className="w-8 h-20 bg-[#006847]" />
          <div className="w-8 h-20 bg-white flex items-center justify-center">
            <span className="text-2xl">🦅</span>
          </div>
          <div className="w-8 h-20 bg-[#CE1126]" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8 py-12">
        {/* Main Headline */}
        <h1 
          className="text-6xl md:text-8xl lg:text-9xl font-bold text-center mb-6 animate-pulse"
          style={{ 
            fontFamily: 'Georgia, serif',
            textShadow: '0 0 40px rgba(255, 215, 0, 0.5), 0 0 80px rgba(255, 215, 0, 0.3)',
            background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          ¡Feliz Cumpleaños, Rosa!
        </h1>

        {/* Subheadline */}
        <p 
          className="text-2xl md:text-3xl lg:text-4xl text-slate-200 text-center mb-12 max-w-4xl"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Desde Hotel Emma — tu familia de Finanzas te celebra hoy 🎉
        </p>

        {/* Rotating Messages */}
        <div className="h-24 flex items-center justify-center mb-12">
          <p 
            key={currentMessageIndex}
            className="text-xl md:text-2xl lg:text-3xl text-amber-200 text-center max-w-3xl px-4 animate-fade-in"
            style={{ 
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              animation: 'fadeInOut 7s ease-in-out'
            }}
          >
            "{birthdayMessages[currentMessageIndex]}"
          </p>
        </div>

        {/* Emma Strong & Finance Team Rocks */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 mt-8">
          <div 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-400"
            style={{ 
              fontFamily: 'Georgia, serif',
              textShadow: '0 0 20px rgba(52, 211, 153, 0.5)'
            }}
          >
            Emma Strong
          </div>
          <div className="hidden md:block text-4xl text-amber-400">✦</div>
          <div 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-rose-400"
            style={{ 
              fontFamily: 'Georgia, serif',
              textShadow: '0 0 20px rgba(251, 113, 133, 0.5)'
            }}
          >
            The Finance Team Rocks
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-8 text-6xl opacity-30 animate-bounce" style={{ animationDuration: '3s' }}>🎂</div>
        <div className="absolute top-1/3 right-12 text-5xl opacity-30 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>🎈</div>
        <div className="absolute bottom-1/3 left-16 text-5xl opacity-30 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>🎁</div>
        <div className="absolute bottom-1/4 right-20 text-6xl opacity-30 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>🌟</div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 z-10 text-center">
        <p 
          className="text-lg md:text-xl text-slate-400"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Con cariño, tu equipo de Finanzas de Hotel Emma
        </p>
      </div>

      {/* CSS for fade animation */}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        
        .animate-fade-in {
          animation: fadeInOut 7s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default RosaBirthday;
