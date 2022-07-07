document.getElementById("toggle-dark-mode").addEventListener("click", async () => {
  const isDarkMode = await window.darkMode.toggle()
  document.getElementById("theme-source").innerHTML = isDarkMode ? "Dark" : "Light"
})

document.getElementById("reset-to-system").addEventListener("click", async () => {
  await window.darkMode.system()
  document.getElementById("theme-source").innerHTML = "System"
})

async function testIt() {
  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
  })
  document.getElementById("device-name").innerHTML = device.name || `ID: ${device.id}`
}
// 蓝牙事件
document.getElementById("clickme").addEventListener("click", testIt)

// hid
async function testhid() {
  const grantedDevices = await navigator.hid.getDevices()
  let grantedDeviceList = ""
  grantedDevices.forEach((device) => {
    grantedDeviceList += `<hr>${device.productName}</hr>`
  })
  document.getElementById("granted-devices").innerHTML = grantedDeviceList
  const grantedDevices2 = await navigator.hid.requestDevice({
    filters: [],
  })

  grantedDeviceList = ""
  grantedDevices2.forEach((device) => {
    grantedDeviceList += `<hr>${device.productName}</hr>`
  })
  document.getElementById("granted-devices2").innerHTML = grantedDeviceList
}

document.getElementById("clickhid").addEventListener("click", testhid)

function handleKeyPress(event) {
  document.getElementById("last-keypress").innerText = event.key
}

window.addEventListener("keyup", handleKeyPress, true)

document.getElementById("getCard").addEventListener("click", function () {
  const xhr = new XMLHttpRequest()
  xhr.open("GET", "http://localhost:6060/home/cardList?page=1")
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) this.innerText = xhr.response
  }
  xhr.send()
})
