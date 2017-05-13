window.simplysocial = (function() {
	var simplysocial = {
		init: function(view, q) {
			this.cleanUp();
			this.loadContent(view, q);
		},
		cleanUp: function() {
			$(".content .widget, .content .load-more").remove();
		},
		loadContent: function(view, q) {
			var $this = this;
			var posts = _.clone(data.posts);
			if (q != "all") {
				posts = _.filter(data.posts, function(o) { return o.type == q; });
			}

			_.forEach(posts, function(item, index) {
				var wigdet = $this.createWidget(item, view);
			});
			/*$('.content').masonry({
				itemSelector: '.widget'
			});*/
		},
		createWidget: function(item, view) {
			var _class = (view == "list") ? "widget col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3" : "widget col-xs-6 col-sm-4";
			var $container = $("<div>", {"class": _class});
			var $post = $("<div>", {"class": "post clearfix"});
			var $profile_picture = $("<img>", {"src": "images/" + item.profilePicture});
			var $postContentContainer = $("<div>", {"class": "post-container"});
			var $postAuthor = $("<div>", {"class": "post-author"}).append(item.name);
			var $postContent = $("<div>", {"class": "post-content"}).append(item.content);
			var $postReplies = $("<div>", {"class": "post-replies"});
			var $postMedia = "";
			if (item.type != "text") {
				$postMedia = $("<div>", {"class": "post-media"}).append("<img src='" + item.media + "' alt='" + item.content + "'>");
				$postContent.append($("<a>", {"href": item.link, "target": "_blank", "title": item.link}).append(item.link));
			}
			if (_.isArray(item.replies)) {
				$postReplies.append($("<a>", {"href": "#", "title": "Expand"}).append("Expand <img src='images/arrowDown.png' alt='Expand'>"));
			}
			var $postActions = $("<div>", {"class": "post-actions"}).append(this.createActions(item));
			$postContentContainer.append($postActions)
								.append($postAuthor)
								.append($postContent)
								.append($postReplies);

			$post.append($profile_picture)
				.append($postContentContainer);
			$container.append($post)
					.append($postMedia);

			$(".content").append($container);
		},
		createActions: function(item) {
			return $("<ul>").append($("<li>").append("<a href='#' title='Share'><img src='images/shareIcon.png' alt='Share'></a>"))
							.append($("<li>").append("<a href='#' title='Like'><img src='images/likeIcon.png' alt='Like'></a>"))
							.append($("<li>").append(item.timeAgo));

		}
	};
	return simplysocial;
}());

$(function() {
	$(".calloutbox input").focus();
	simplysocial.init("list", "all");
	$(".calloutbox input").on("keydown", function() {
		var $this = $(this);
		if ($this.val().trim() == "What's on your mind?") {
			$this.val("");
		}
	}).on("blur", function() {
		var $this = $(this);
		if ($this.val().trim() == "") {
			$this.val("What's on your mind?").focus();
		}
	});
	$(".tabs li").on("click", function(e) {
		e.preventDefault();
		var $this = $(this);
		$(".tabs li").removeClass("active");
		$this.addClass("active");
		var filter = $this.attr("data-filter");
		simplysocial.init("list", filter);
	});
	$(".load-more").on("click", function(e) {
		e.preventDefault();
		simplysocial.loadContent("list", $(".tabs li.active").attr("data-filter"));
	});
});
