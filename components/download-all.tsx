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
    console.log('download all')
    document.querySelectorAll('a[data-type=download]').forEach((a) => {
      console.log(a.getAttribute('href'))
      const href = a.getAttribute('href') as string
      const filename = a.getAttribute('data-filename') as string
      downloadFile(href, filename as string)
    })
  }

  return <button className="text-yellow-400" onClick={handleClick}>Descargar todos</button>
}