
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
