const axios = require('axios')
const { convert } = require('html-to-text')
const fs = require('fs')
const url = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@'


const data = async(userName) => {
  return await axios.get(url + userName).then(res => {
    console.log('res', res.data.items)
    return res.data.items
  }).catch((e) => console.log(e))
}

data('MatrixWorld').then(content => {
  const blogData = {
    blogs: content.map(item => {
      return {
        ...item,
        // pubDate: item.pubDate.split(' ')[0].slice(5),
        description: convert(item.description, {
          formatters: {
            hidden: function (elem, fn, options) {
              return ''
            },
          },
          selectors: [
            // Assign it to `foo` tags.
            {
              selector: 'h3',
              format: 'hidden',
            },
            {
              selector: 'a',
              format: 'hidden',
            },
          ],
          hideLinkHrefIfSameAsText: true,
          ignoreHref: true,
          ignoreImage: true,
        }),
      }
    }),
  }

  const buf = Buffer.from(JSON.stringify(blogData))

  fs.writeFile('./content/blog.json', buf, err => {
    if (err) {
      console.error(err)
      return
    }
    console.log('success')
  })
})