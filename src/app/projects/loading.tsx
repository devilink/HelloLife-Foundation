export default function Loading() {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center pt-32 pb-24">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Loading Projects...</h2>
        <p className="text-muted-foreground">Please wait while we fetch the latest project information.</p>
      </div>
    </div>
  );
}
