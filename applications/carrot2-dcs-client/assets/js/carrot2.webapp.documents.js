(function($) {
  $.pluginhelper.make("documents", function(el, options) {
    var $listing = $(options.components.listing);
    var $summary = $(options.components.summary);

    var currentData;

    // Compiled templates
    var documentTemplate = _.template('<div id="d<%- id %>">' +
      '<h2><a href="<%- url %>"><%- title %></a></h2>' +
      '<p><%- snippet %></p>' +
      '<a href="<%- url %>"><%- url %></a>' +
      '<span><%= sources.join(\'</span><span>\') %></span>' +
    '</div>');
    var summaryRootTemplate = _.template('Top <%- count %> results for <b><%- query %></b>');
    var summaryOneGroupTemplate = _.template('<%- count %> results in group <b><%- label %></b>');
    var summaryMoreGroupsTemplate = _.template('<%- count %> results in groups <%= groups %> ');

    // Export public methods
    this.populate = populate;
    this.select = select;
    this.clearSelection = clearSelection;
    return undefined;

    //
    // Private methods
    //
    function populate(data) {
      var docDefaults = { title: "", snippet: "", url: "", sources: [] };
      $listing.html(_.reduce(data.documents, function (html, doc) {
        html += documentTemplate(_.defaults(doc, docDefaults));
        return html;
      }, ""));

      $summary.html(summaryRootTemplate({
        count: data.documents.length,
        query: data.query
      }));

      currentData = data;
    }

    function select(ids, labels) {
      $listing.children().each(function() {
        $(this).toggle(ids[this.id.substring(1)] === true);
      });

      if (labels.length == 1) {
        $summary.html(summaryOneGroupTemplate({
          count: _.size(ids),
          label: labels[0]
        }));
      } else {
        $summary.html(summaryMoreGroupsTemplate({
          count: _.size(ids),
          groups: "<b>" + labels.join("</b>, <b>") + "</b>"
        }));
      }
    }

    function clearSelection() {
      $listing.children().show();

      $summary.html(summaryRootTemplate({
        count: currentData.documents.length,
        query: currentData.query
      }));
    }
  });
})(jQuery);
