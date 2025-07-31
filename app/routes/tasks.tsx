export default function TasksPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h2 className="text-2xl font-bold tracking-tight">Tarefas</h2>
        <p className="text-muted-foreground">
          Gerencie suas tarefas e projetos aqui.
        </p>
      </div>
      <div className="px-4 lg:px-6">
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            Conteúdo das tarefas será implementado aqui.
          </p>
        </div>
      </div>
    </div>
  )
}