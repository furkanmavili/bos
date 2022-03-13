
const STORAGE_KEY = "bos_data"

function getDataFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []
  const parsed = JSON.parse(data)
  return parsed
}

function removeItemFromStorage(id) {
  const oldData = getDataFromStorage()
  const filtered = oldData.filter(data => data.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

function updateItem(id, props) {
  let oldData = getDataFromStorage()
  let exist = oldData.findIndex(data => data.id === id)
  if (exist === -1) return
  oldData[exist] = {...oldData[exist], ...props}
  localStorage.setItem(STORAGE_KEY,JSON.stringify(oldData))
} 


function saveToStorage({id, text, textSize, x, y, color}) {
  let oldData = getDataFromStorage()
  const data = {
    id: id,
    x: Math.floor(x),
    y: Math.floor(y),
    text: text,
    textSize: textSize,
    color: color
  }
  let exist = oldData.findIndex(data => data.id === id)
  if (exist !== -1) {
    oldData[exist] = data
  } else {
    oldData.push(data)
  }
  localStorage.setItem(STORAGE_KEY,JSON.stringify(oldData))
}

export {getDataFromStorage, removeItemFromStorage, saveToStorage, updateItem}