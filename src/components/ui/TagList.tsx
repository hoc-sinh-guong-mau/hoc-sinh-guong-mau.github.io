interface TagListProps {
  items: readonly string[]
  label: string
}

export function TagList({ items, label }: TagListProps) {
  return (
    <ul className="tag-list" aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
