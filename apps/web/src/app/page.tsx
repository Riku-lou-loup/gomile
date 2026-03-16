// app/page.tsx
import Button from "@/components/ui/design-system/button/button";
import Footer from "@/components/ui/design-system/header_footer/footer";
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
 
      {/* Contenu fictif pour pousser le footer en bas */}
      <main className="flex-1 flex items-center justify-center px-10">
        <Button>Bouton</Button>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">Footer — Test</h1>
          <p className="text-text-muted font-body">
            Le footer est affiché en bas de la page.
          </p>
        </div>
      </main>
 
      {/* Footer */}
      <Footer />
 
    </div>
  );
}



