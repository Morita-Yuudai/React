def getsoup(url):
    res =requests.get(url)
    res.raise_for_status
    soup = BeautifulSoup(res.text,"html.parsr")
return soup

"P７１にて、htmlでherf属性で"
"属性の中にclass"