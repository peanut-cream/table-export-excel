export const TOKEN_KEY = "TOKEN"

export const setToken = (token: string) => {
  const obj = {
    timestamp: new Date().getTime() + 7 * 24 * 60 * 60,
    token
  }
  localStorage.setItem(TOKEN_KEY, JSON.stringify(obj))
}

export const getToken = () => {
  let token
  let time
  try {
    const tokenObj = JSON.parse(localStorage.getItem(TOKEN_KEY) as string)
    token = tokenObj?.token || ""
    time = tokenObj?.timestamp || ""
  } catch (error) {}
  if (token && new Date().getTime() < time) return token
  else return false
}

export const removeToken = () => {
  return localStorage.removeItem(TOKEN_KEY)
}
