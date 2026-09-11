const items = [
  "Python",
  "LangChain",
  "FastAPI",
  "BERT",
  "AWS",
  "RAG",
  "PySpark",
  "Kafka",
  "PostgreSQL",
  "Docker",
  "LLM Agents",
  "TensorFlow",
];

export default function Marquee() {
  const loop = [...items, ...items];
  return (
    <div className="relative border-y border-border py-6 overflow-hidden">
      <div className="flex w-max gap-10 animate-marquee">
        {loop.map((item, i) => (
          <span
            key={i}
            className="font-display text-2xl md:text-4xl text-muted/60 whitespace-nowrap"
          >
            {item}
            <span className="text-accent mx-6">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
