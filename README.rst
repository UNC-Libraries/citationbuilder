Citation Builder
=====================================================

Citation Builder is an application that generates citations from user entered 
form data.

This is inspired by the Citation Builder application developed by NCSU
(https://github.com/phpforfree/citationbuilder).

Building
--------

Citation Builder can be built using the `RequireJS optimizer
<http://requirejs.org/docs/optimization.html>`_ (when using Node)::

$ r.js -o build.js

Note that while the RequireJS optimizer copies over all the files in the js directory,
the only javascript files that are needed once it's built are ``main.js`` and
``require-jquery.js``.

Adding a new style/source
-------------------------

The forms that are loaded are controlled by the ``source`` query param, and the
citation format is controlled by the ``style`` param. To add a new citation format
you will first need to add the citation format style sheet to the ``src/styles`` directory (see
the `CSL project <https://github.com/citation-style-language/styles>`_ for more styles).
Next, create a directory in ``src/templates`` with the same name as the CSL style sheet
you just added, minus the extension. A `mustache template <https://github.com/janl/mustache.js/>`_
should be created for each source type, currently: book, chapter, journal, magazine,
newspaper and website. Use any of the existing templates as a starting point. The
id attribute for each template should follow the existing pattern, ``tmpl-<source type>``,
as this is used to dynamically include the template.

Several common form fields are included in ``templates/common.mustache``. These can be
added to your form as partials.

Form field names should match the CSL variables for the associated style. Some
data massaging is required for contributors, so you should use the contributor
partial rather than creating your own contributor fields.

:Author:
    Mike Graves
:Copyright:
    Copyright (c) 2012 University Library, University of North Carolina. See LICENSE for details.