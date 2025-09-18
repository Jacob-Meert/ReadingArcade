import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CapsLockProvider } from "@/contexts/CapsLockContexts";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import StackFireBall from "./games/StackFireBall.tsx"
import CapybaraClickerPro from "./games/CapybaraClickerPro.tsx"
import LoveTester from "./games/LoveTester.tsx"
import GetOnTop from "./games/GetOnTop.tsx"
import BlockBlast from "./games/BlockBlast.tsx"
import EscapeCar from "./games/EscapeCar.tsx"
import FastFoodRush from "./games/FastFoodRush.tsx"
import StickmanParkour from "./games/StickmanParkour.tsx"
import SuperCarDriving from "./games/SuperCarDriving.tsx"
import KicktheDummy from "./games/KicktheDummy.tsx"
import MathsForKids from "./games/MathsForKids.tsx"
import NumberMerge from "./games/NumberMerge.tsx"
import MatchstickMathPuzzle from "./games/MatchstickMathPuzzle.tsx"
import MathSlither from "./games/MathSlither.tsx"
import MedievalCastleDefense from "./games/MedievalCastleDefense.tsx"
import Wordle from "./games/Wordle.tsx"
import OmNomRun from "./games/OmNomRun.tsx"
import GardenBloom from "./games/GardenBloom.tsx"
import BubbleTower3D from "./games/BubbleTower3D.tsx"
import CannonBalls3D from "./games/CannonBalls3D.tsx"
import EightBallBilliardsClassic from "./games/EightBallBilliardsClassic.tsx"
import ArcheryWorldTour from "./games/ArcheryWorldTour.tsx"
import MotoX3MPoolParty from "./games/MotoX3MPoolParty.tsx"

const queryClient = new QueryClient();

const App = () => (
  <CapsLockProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
					<Route path="/StackFireBall" element={<StackFireBall/>} />
					<Route path="/CapybaraClickerPro" element={<CapybaraClickerPro/>} />
					<Route path="/LoveTester" element={<LoveTester/>} />
					<Route path="/GetOnTop" element={<GetOnTop/>} />
					<Route path="/BlockBlast" element={<BlockBlast/>} />
					<Route path="/EscapeCar" element={<EscapeCar/>} />
					<Route path="/FastFoodRush" element={<FastFoodRush/>} />
					<Route path="/StickmanParkour" element={<StickmanParkour/>} />
					<Route path="/SuperCarDriving" element={<SuperCarDriving/>} />
					<Route path="/KicktheDummy" element={<KicktheDummy/>} />
					<Route path="/MathsForKids" element={<MathsForKids/>} />
					<Route path="/NumberMerge" element={<NumberMerge/>} />
					<Route path="/MatchstickMathPuzzle" element={<MatchstickMathPuzzle/>} />
					<Route path="/MathSlither" element={<MathSlither/>} />
					<Route path="/MedievalCastleDefense" element={<MedievalCastleDefense/>} />
					<Route path="/Wordle" element={<Wordle/>} />
					<Route path="/OmNomRun" element={<OmNomRun/>} />
					<Route path="/GardenBloom" element={<GardenBloom/>} />
					<Route path="/BubbleTower3D" element={<BubbleTower3D/>} />
					<Route path="/CannonBalls3D" element={<CannonBalls3D/>} />
					<Route path="/EightBallBilliardsClassic" element={<EightBallBilliardsClassic/>} />
					<Route path="/ArcheryWorldTour" element={<ArcheryWorldTour/>} />
					<Route path="/MotoX3MPoolParty" element={<MotoX3MPoolParty/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </CapsLockProvider>
);

export default App;