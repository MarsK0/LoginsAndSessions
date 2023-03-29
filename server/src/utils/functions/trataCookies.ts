interface Cookie{
  name: string;
  value: string;
}

function trataCookies(reqCookies: string): Array<Cookie>{
  const cookies: Array<string> = reqCookies.split(";")
  const arrayCookies: Array<Cookie> = []

  cookies.forEach((element) => {
    const nomeValor = element.split("=")
    const objetoCookie: Cookie = {
      name: nomeValor[0],
      value: nomeValor[1]
    }

    arrayCookies.push(objetoCookie)
  })


  return arrayCookies
}

export default trataCookies