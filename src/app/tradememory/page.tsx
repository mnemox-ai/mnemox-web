import { AddressAnalyzer } from '@/components/tradememory/AddressAnalyzer';
import { LoopSection } from '@/components/tradememory/LoopSection';
import { InstallSection } from '@/components/tradememory/InstallSection';

export default function TradeMemoryPage() {
  return (
    <div className="tm-page">
      <AddressAnalyzer />
      <LoopSection />
      <InstallSection />
    </div>
  );
}
