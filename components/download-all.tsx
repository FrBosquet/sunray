'use client'

const downloadFile = async (url: string, filename: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export const DownloadAll = () => {
  const handleClick = () => {
    document.querySelectorAll('a[data-type=download]').forEach((a) => {
      const href = a.getAttribute('href') as string
      const filename = a.getAttribute('data-filename') as string
      downloadFile(href, filename as string)
    })
  }

  return <button className="text-yellow-400 hover:text-yellow-600 transition" onClick={handleClick}>Descargar todos</button>
}