export const paginateWords = (pageNumber: number, size = 500) => (
  words: string[]
) => {
  const pages = words.reduce(
    (result: { text: string[]; length: number }[], curr) => {
      if (
        result.length &&
        result[result.length - 1].length + curr.length + 1 <= size
      ) {
        result[result.length - 1].text.push(curr)
        result[result.length - 1].length += curr.length + 1
      } else {
        result.push({ text: [curr], length: curr.length })
      }
      return result
    },
    []
  )

  const page = (pages[pageNumber - 1] || { text: [] }).text

  return { pages: pages.length, page, size }
}
