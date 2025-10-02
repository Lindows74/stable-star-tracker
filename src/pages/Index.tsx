import Layout from "@/components/layout/Layout";
import { HorseList } from "@/components/horses/HorseList";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">My Horses</h2>
          <p className="text-muted-foreground">
            Manage your horse collection and track their stats and traits.
          </p>
        </div>

        <div className="bg-card rounded-lg border">
          <HorseList />
        </div>
      </div>
    </Layout>
  );
};

export default Index;