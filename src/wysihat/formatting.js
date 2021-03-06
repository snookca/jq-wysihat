//= require "./element"

WysiHat.Formatting = (function($){

	var
	ACCUMULATING_LINE	   = {},
	EXPECTING_LIST_ITEM	   = {},
	ACCUMULATING_LIST_ITEM = {};

	return {
		cleanup: function( $el )
		{
			var
			replaceElement = WysiHat.Commands.replaceElement;
			$el
				// Apple's span elements
				.find('span').each(function(){
					var $this = $(this);
					if ( $this.is('.Apple-style-span') )
					{
						$this.removeClass('.Apple-style-span');
					}
					if ( $this.css('font-weight') == 'bold' &&
					 	 $this.css('font-style') == 'italic' )
					{
						$this.removeAttr('style').wrap('<strong>');
						replaceElement( $this, 'em' );
					}
					else if ( $this.css('font-weight') == 'bold' )
					{
						replaceElement( $this.removeAttr('style'), 'strong' );
					}
					else if ( $this.css('font-style') == 'italic' )
					{
						replaceElement( $this.removeAttr('style'), 'em' );
					}
				 }).end()
				//.find('[style]').each(function(){
				//	var $this = $(this);
				//	if ( $this.attr('style') ){}
				// })
				// divs that should be paragraphs
				.children('div').each(function(){
				 	var $this = $(this);
				 	if ( ! $this.get(0).attributes.length )
				 	{
				 		replaceElement( $this, 'p' );
				 	}
				 }).end()
				// bold
				.find('b').each(function(){
				 	replaceElement($(this),'strong');
				 }).end()
				// italic
				.find('i').each(function(){
				 	replaceElement($(this),'em');
				 }).end()
				// empty paragraphs
				.find('p:empty').remove();
		},
		format: function( $el )
		{
			var
			re_blocks = new RegExp( '<\/(' + WysiHat.Element.getBlocks().join('|') + ')>', 'g' ),
			html = $el.html()
						.replace( /<\/?[\w]+/g, function(tag){
							return tag.toLowerCase();
						 })
						//.replace('</div><div><br></div><div>','</p><p>')
						//.replace('<br></div><div>','<br>')
						//.replace('</div><div>','</p><p>')
						//.replace('<br></div>','</p>')
						//.replace('<div>','<p>')
						//.replace('</div>','</p>')
						.replace('<p>&nbsp;</p>','')
						// Fancy formatting
						.replace( re_blocks,'</$1>\n' )
						.replace(/\n+/,'\n')
						.replace(/<p>\n+<\/p>/,'');
			$el.html( html );
		},
		getBrowserMarkupFrom: function( $el )
		{

			var $container = $('<div>' + $el.val().replace(/\n/,'') + '</div>');
			
			this.cleanup( $container );
			
			//function spanify( $element, style )
			//{
			//	$element.replaceWith(
			//		'<span style="' + style + '" class="Apple-style-span">' + $element.html() + '</span>'
			//	);
			//}
            //
			//function convertStrongsToSpans()
			//{
			//	$container.find( 'strong' ).each(function(){
			//		spanify( $(this), 'font-weight: bold' );
			//	});
			//}
            //
			//function convertEmsToSpans()
			//{
			//	$container.find( 'em' ).each(function(){
			//		spanify( $(this), 'font-style: italic' );
			//	});
			//}
            //
			//function convertDivsToParagraphs()
			//{
			//	$container.find( 'div' ).each(function(){
			//		replaceElement( $(this), 'p' );
			//	});
			//}
            //
			//if ( $.browser.webkit || $.browser.mozilla )
			//{
			//	convertStrongsToSpans();
			//	convertEmsToSpans();
			//}
			//else if ( $.browser.msie || $.browser.opera )
			//{
			//	convertDivsToParagraphs();
			//}
			
			// make sure we always start with a paragraph
			if ( $container.html() == '' )
			{
				$container.html('<p><br/></p>');
			}

			return $container.html();

		},

		getApplicationMarkupFrom: function( $el )
		{
			var
			$clone			= $el.clone(),
			el_id			= $el.attr('id'),
			replaceElement	= WysiHat.Commands.replaceElement,
			$container;
			
			//$p		= $('<p></p>'),
			//mode	= ACCUMULATING_LINE,
			//$result, $container,
			//line, lineContainer,
			//previousAccumulation;
            //
			//function walk( nodes )
			//{
			//	var
			//	length	= nodes.length,
			//	node, $node, $newNode, tagName, i;
            //
			//	for ( i=0; i < length; i++ )
			//	{
			//		node	= nodes[i];
			//		$node	= $(node);
			//		
			//		if ( node.nodeType == Node.ELEMENT_NODE )
			//		{
			//			tagName = node.tagName.toLowerCase();
			//			open( tagName, node );
			//			walk( node.childNodes );
			//			close( tagName );
            //
			//		}
			//		else if ( node.nodeType == Node.TEXT_NODE )
			//		{
			//			read( node.nodeValue );
			//		}
			//	}
			//}
            //
			//function open( tagName, node )
			//{
			//	$node = $(node);
            //
			//	if ( mode == ACCUMULATING_LINE )
			//	{
			//		if ( isBlockElement(tagName) )
			//		{
			//			if ( isEmptyParagraph( $node ) )
			//			{
			//				accumulate( $('<br />').get(0) );
			//			}
            //
			//			flush();
			//			
			//			if ( isListElement(tagName) )
			//			{
			//				$container	= insertList( tagName );
			//				mode		= EXPECTING_LIST_ITEM;
			//			}
			//		}
			//		else if ( isLineBreak(tagName) )
			//		{
			//			if ( isLineBreak( getPreviouslyAccumulatedTagName() ) )
			//			{
			//				$(previousAccumulation).remove();
			//				flush();
			//			}
            //
			//			accumulate( $node.clone().get(0) );
            //
			//			if ( ! previousAccumulation.previousNode )
			//			{
			//				flush();
			//			}
			//		}
			//		else
			//		{
			//			accumulateInlineElement( tagName, $node );
			//		}
            //
			//	}
			//	else if ( mode == EXPECTING_LIST_ITEM )
			//	{
			//		if ( isListItemElement(tagName) )
			//		{
			//			mode = ACCUMULATING_LIST_ITEM;
			//		}
            //
			//	}
			//	else if ( mode == ACCUMULATING_LIST_ITEM )
			//	{
			//		if ( isLineBreak(tagName) )
			//		{
			//			accumulate( $node.clone().get(0) );
			//		}
			//		else if ( ! isBlockElement(tagName) )
			//		{
			//			accumulateInlineElement( tagName, $node );
			//		}
			//	}
			//}
            //
			//function close( tagName )
			//{
			//	if ( mode == ACCUMULATING_LINE )
			//	{
			//		if ( isLineElement( tagName ) )
			//		{
			//			flush();
			//		}
            //
			//		if ( line != lineContainer )
			//		{
			//			lineContainer = lineContainer.parentNode;
			//		}
			//	}
			//	else if ( mode == EXPECTING_LIST_ITEM )
			//	{
			//		if ( isListElement(tagName) )
			//		{
			//			$container = $result;
			//			mode = ACCUMULATING_LINE;
			//		}
			//	}
			//	else if ( mode == ACCUMULATING_LIST_ITEM )
			//	{
			//		if ( isListItemElement(tagName) )
			//		{
			//			flush();
			//			mode = EXPECTING_LIST_ITEM;
			//		}
            //
			//		if ( line != lineContainer )
			//		{
			//			lineContainer = lineContainer.parentNode;
			//		}
			//	}
			//}
            //
			//function isBlockElement( tagName )
			//{
			//	return isLineElement(tagName) || isListElement(tagName);
			//}
            //
			//function isLineElement( tagName )
			//{
			//	return	tagName == "p" ||
			//			tagName == "div" ||
			//			tagName == "blockquote";
			//}
            //
			//function isListElement( tagName )
			//{
			//	return tagName == "ol" || tagName == "ul";
			//}
            //
			//function isListItemElement(tagName)
			//{
			//	return tagName == "li";
			//}
            //
			//function isLineBreak(tagName)
			//{
			//	return tagName == "br";
			//}
            //
			//function isEmptyParagraph( $node )
			//{
			//	return	$node.is('p:empty') ||
			//			( $node.is('p') && $.trim( $node.html() ) == '' );
			//}
            //
			//function read(value)
			//{
			//	accumulate(document.createTextNode(value));
			//}
            //
			//function accumulateInlineElement( tagName, $node )
			//{
			//	// create a clean element
			//	var $el	= $( $node.get(0).cloneNode(false) ),
			//	temp;
			//	
			//	if ( tagName == 'span' )
			//	{
			//		if ( $node.css( 'fontWeight' ) == 'bold' )
			//		{
			//			temp = $('<strong/>').get(0);
			//			accumulate( temp );
			//			lineContainer = temp;
			//		}
			//		if ( $node.css('fontStyle') == 'italic' )
			//		{
			//			temp = $('<em/>').get(0);
			//			accumulate( temp );
			//			lineContainer = temp;
			//		}
			//	}
			//	else
			//	{
			//		$el = $el.get(0);
			//		accumulate( $el );
			//		lineContainer = $el;
			//	}
			//}
            //
			//function accumulate(node)
			//{
			//	if ( mode != EXPECTING_LIST_ITEM )
			//	{
			//		if ( ! line )
			//		{
			//			line = lineContainer = createLine();
			//		}
			//		previousAccumulation = node;
			//		lineContainer.appendChild(node);
			//	}
			//}
            //
			//function getPreviouslyAccumulatedTagName()
			//{
			//	if ( previousAccumulation &&
			//		 previousAccumulation.nodeType == Node.ELEMENT_NODE )
			//	{
			//		return previousAccumulation.tagName.toLowerCase();
			//	}
			//}
            //
			//function flush()
			//{
			//	if ( line && line.childNodes.length )
			//	{
			//		$container.append( $(line) );
			//		line = lineContainer = null;
			//	}
			//}
            //
			//function createLine()
			//{
			//	var $el;
			//	if ( mode == ACCUMULATING_LINE )
			//	{
			//		$el = $('<div></div>');
			//	}
			//	else if (mode == ACCUMULATING_LIST_ITEM)
			//	{
			//		$el = $('<li></li>');
			//	}
			//	return $el.get(0);
			//}
            //
			//function insertList(tagName)
			//{
			//	return $('<'+tagName+'></'+tagName+'>')
			//				.appendTo( $result );
			//}

			$container = $('<div></div>').html($clone.html());
			this.cleanup( $container );
			
			// semantic cleanup
			//walk( $clone.get(0).childNodes );
			//flush();
			
			this.format( $container );
			return $container.html();
		}
		
	};

})(jQuery);