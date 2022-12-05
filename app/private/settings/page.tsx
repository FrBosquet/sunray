

import { cookies } from "next/headers"
import { getSettings } from "../../../lib/api"

export default async function Settings() {
	const nextCookies = cookies()
	const token = nextCookies.get('access_token')

	const { settings } = await getSettings(token?.value as string)

	return (
		<div>
			<h2 className="font-bold text-lg">Configuración</h2>
			<form action="/api/settings" method="post" className="flex flex-col gap-2">
				<label htmlFor="baseFolder">Carpeta de google drive:</label>
				<input className="p-1 rounded-sm" type="text" id="baseFolder" name="baseFolder" defaultValue={settings.baseFolder} />
				<label htmlFor="inputSheet">Hoja de calculo:</label>
				<input className="p-1 rounded-sm" type="text" id="inputSheet" name="inputSheet" defaultValue={settings.inputSheet} />
				<label htmlFor="columnRange">Intervalo:</label>
				<input className="p-1 rounded-sm" type="text" id="columnRange" name="columnRange" defaultValue={settings.columnRange} />
				<button type="submit"
					className="mt-4 w-full p-2 flex justify-center items-center gap-1 bg-blue-500 rounded-md hover:bg-blue-300 transition-all"
				>Actualizar</button>
			</form>
		</div>
	)
}