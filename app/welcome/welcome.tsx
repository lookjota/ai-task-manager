import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

export function Welcome() {
  return (
    <main className="p-12" >
    <section className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo ao Projeto!</CardTitle>
            <CardDescription>
              Este é um exemplo de card utilizando os componentes shadcn/ui.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Explore os componentes reutilizáveis para criar interfaces modernas e acessíveis com facilidade. 
              Personalize este card conforme a necessidade do seu projeto.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="default">Começar</Button>
          </CardFooter>
        </Card>
      </div>
    </section>
    </main>
  );
}
