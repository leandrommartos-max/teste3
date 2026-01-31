import { TopbarSticky } from "@/components/global/TopbarSticky";
import { FooterLight } from "@/components/global/FooterLight";

export default function TermsAndPrivacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopbarSticky 
        title="Termos de Serviço e Política de Privacidade" 
        showLogout={false}
        backTo="/landing"
      />

      <main className="flex-1 px-4 py-8">
        <div className="container max-w-3xl mx-auto">
          <div className="card-institutional p-6 md:p-8">
            <p className="text-sm text-muted-foreground mb-6">
              Atualizado em: 01/01/2024
            </p>

            <div className="prose prose-sm max-w-none text-foreground">
              <h2 className="font-display text-xl font-semibold mb-4">
                1. Termos de Serviço
              </h2>
              <p className="text-muted-foreground mb-4 text-justify">
                Lembrar de trocar depois
              </p>
              <p className="text-muted-foreground mb-6 text-justify">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>

              <h2 className="font-display text-xl font-semibold mb-4">
                2. Política de Privacidade
              </h2>
              <p className="text-muted-foreground mb-4 text-justify">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
              <p className="text-muted-foreground mb-6 text-justify">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
                sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>

              <h2 className="font-display text-xl font-semibold mb-4">
                3. Uso de Dados
              </h2>
              <p className="text-muted-foreground mb-4 text-justify">
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, 
                adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et 
                dolore magnam aliquam quaerat voluptatem.
              </p>

              <h2 className="font-display text-xl font-semibold mb-4">
                4. Contato
              </h2>
              <p className="text-muted-foreground text-justify">
                Em caso de dúvidas sobre estes termos, entre em contato com o NEP - 
                Núcleo de Educação Permanente em Saúde da Prefeitura Municipal de Paulínia.
              </p>
            </div>
          </div>
        </div>
      </main>

      <FooterLight />
    </div>
  );
}
