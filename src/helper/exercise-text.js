export function exerciseText(exercise, language) {
  const translated = exercise?.translations?.[language];
  return {
    title: translated?.title || exercise?.title || '',
    content: translated?.content || exercise?.content || '',
  };
}

export function exerciseSearchText(exercise) {
  return [
    exercise?.title,
    exercise?.content,
    ...Object.values(exercise?.translations || {}).flatMap((text) => [
      text?.title,
      text?.content,
    ]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}
