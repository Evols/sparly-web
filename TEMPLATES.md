
# Sparly web: form and templates

To create templates, you must have a (working) HTML page, then adapt it to an EJS template, readable by Sparly web, and write a Sparly descriptor of the template.
Then, when the user will preview the page or publish it, the template will be rendered using the form data (the data that the user wrote in the form).

## Creating the HTML web page

Sparly web is actually designed to support as much HTML web pages as possible.
It can handle pages written in HTML, CSS, and Javascript. However, advanced frameworks (React, etc) are untested.

Note that only the HTML page will be editable by the user in the Sparly web form. So, if you want the user to be able to edit style, you must integrate these style elements in a `<style>` tag inside the HTML code.
Other files (CSS, JS, not-editable images except Unplash, defaults images except Unsplash) have to be hosted and available publicly, and linked in the HTML page (as an example, using `<link href="adresse du fichier" rel="stylesheet">` for CSS).

The web page shown in the Sparly web form is the same as the one actually published. To achieve that, we actually show the whole page in an `<iframe>`, so it supports a lot of HTML features, without colliding with the Sparly web code.

## Adapting the HTML page to an EJS template

Sparly web uses the [EJS](https://ejs.co/) templating engine. They explain in a great length the syntax on their [website](https://ejs.co/).

Sparly web uses the form field labels as variables in EJS: each Sparly web field permits to edit the value corresponding to a key ; and each time a field is edited, the HTML page is regenerated using EJS.

Let's take the following EJS code:

```html
<div><%- name %></div>
```

If we have a field `name` which value is `Baptiste`, the generated HTML code is:

```html
<div>Baptiste</div>
```

## Sparly descriptor of the template

To handle data in Sparly web, each template needs a decriptor, which is a file that contains metadata about each field, such as their type (string, image, array). If the field is an array, its children will be typed objects.

Note that the textfields that have a linebreak `<br/>` will be replaced by an actual linebreak (`\n`) when they'll be displayed to the user in the form, and that they will be converted in `<br/>` tags in the form data.

The "title" type is not editable: it's used as a section title, only used in the form, not on the web page.

The description is a JSON document, with an example below:

```jsonc
{
    /*
     * Section titles have the "title" type. They are not editable in the form: it's used as a section title, only used in the form, not on the web page.
     * The actual titre string is in "label"
     */
    "h2title": {
        "type": "title",
        "label": "My awesome title!"
    },
    /*
     * Text field have the "string" type.
     * Their description is in "label", and their default value is in "value".
     */
    "title": {
        "type": "string",
        "label": "Title of the website",
        "value": "My marvelous website!"
    },
    /*
     * Images have the "img" type.
     * Their description is in "label", and their default value in "value":
     * It's an object, with the image source type ("unsplash" for an Unsplash image, "url" for an image hosted, reachable by an URL),
     * and the path in "path" (the URL if img_source is "url", the Unsplash ID if img_source is "unsplash").
     */
    "main_image": {
        "type": "img",
        "label": "Image principale",
        "value": {
            "img_source": "unsplash",
            "path": "idk42lBPleA", /* Unsplash ID, that you can find at: https://unsplash.com/photos/{path}. In this example, it's at https://source.unsplash.com/idk42lBPleA */
            "authorName": "Nathan Dumlao", /* On Unsplash, you have to specify the author name and username. authorName is the name of the image's author, and authorUsername is the username, so that the Unsplash profile page of the author is https://unsplash.com/@{authorUsername}. In this example, it's at https://unsplash.com/@nate_dumlao */
        }
    },
    /*
     * Lists have the "array" type.
     * Their description is in "label".
     * Their default value in in "value", and the default element to create when the user adds an element in in "default".
     */
    "our_values": {
        "type": "array",
        "label": "Nos valeurs",
        "default": {
            "the_text": {
                "type": "string",
                "label": "Description",
                "value": "A dish"
            },
            "the_img": {
                "type": "img",
                "label": "Image",
                "value": {
                    "img_source": "unsplash",
                    "path": "qq_a0-lyq4Q"
                }
            }
        },
        "value": [
            {
                "the_text": {
                    "type": "string",
                    "label": "Description",
                    "value": "We love pasta,<br/>because it's so good!"
                },
                "the_img": {
                    "type": "img",
                    "label": "Image",
                    "value": {
                        "img_source": "unsplash",
                        "path": "qq_a0-lyq4Q"
                    }
                }
            },
            {
                "the_text": {
                    "type": "string",
                    "label": "Description",
                    "value": "And we love pizza too!"
                },
                "the_img": {
                    "type": "img",
                    "label": "Image",
                    "value": {
                        "img_source": "hosted", /* When the image is hosted on another platform than Unsplash (interne ou externe) */
                        "path": "https://www.demotivateur.fr/images-buzz/cover/7970863015ec40eae5c9e9_pizza-napolitaine-800x420.jpg"
                    }
                }
            }
        ]
    }
}
```

Et les données injectées dans EJS seront les suivantes:

```jsonc
{
    "title": "Mon super site !",
    "main_image": "https://source.unsplash.com/idk42lBPleA",
    "our_values": [
        {
            "the_text": "On adore les pâtes,<br/>parce que c'est trop bon",
            "the_img": "https://source.unsplash.com/qq_a0-lyq4Q"
        },
        {
            "the_text": "Et on aime les pizzas aussi !",
            "the_img": "https://www.demotivateur.fr/images-buzz/cover/7970863015ec40eae5c9e9_pizza-napolitaine-800x420.jpg"
        }
    ]
}
```

The corresponding template could be:

```html
<!DOCTYPE html>
<html>
    <head>
        <title><%- title %></title>
    </head>
    <body>

        <h1><%- title %></h1>
        <%- `<img src="${main_image}" />` %>

        <div>
            <% for (let e of our_values) { %>
                <div>
                    <span class="table-title"><%- e.the_text %></span>
                    <br />
                    <%- `<img src="${e.the_img}" />` %>
                </div>
            <% } %>
        </div>

    </body>
</html>
```

The image sources can be:
- `file` for client-side local files. On the backend, a `file` image will be the name of the file sent in the request.
- `hosted` for images hosted on s3. The main difference with `url` is that when an user removes an image, an `hosted` image will be deleted from s3. The path is the object key on s3, so it can be reached at https://clovercloudugc.s3.amazonaws.com/{path}.
- `unsplash` for Unsplash images. Path is the id of the image, which is at https://unsplash.com/photos/{path}.
- `url` for images hosted externally.
