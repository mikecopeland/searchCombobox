(function($) {
		$.widget("ui.searchCombobox", {
			
			_create: function() {
				var self = this;
				var select = this.element,
				selected = select.children( ":selected" ),
				value = selected.val() ? selected.text() : "";
				
				var maxLength = 0;
				select.children().each(function() {
				   if ($(this).text().length > maxLength){
                   		maxLength = $(this).text().length;
                   }
				});
				
                
				var input = $('<input id="'+select.attr('name')+'SearchText" size="'+maxLength+'"/>')
					.insertAfter(select)
					.hide()
					.val( value )
					.autocomplete({
						delay: 0,
						minLength: 0,
						source: function( request, response ) {
							var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
							response( select.children( "option" ).map(function() {
								var text = $( this ).text();
								if ( this.text && ( !request.term || matcher.test(text) ) )
									return {
										label: text.replace(
											new RegExp(
												"(?![^&;]+;)(?!<[^<>]*)(" +
												$.ui.autocomplete.escapeRegex(request.term) +
												")(?![^<>]*>)(?![^&;]+;)", "gi"
											), "<strong>$1</strong>" ),
										value: text,
										option: this
									};
							}) );
						},
						select: function( event, ui ) {
							ui.item.option.selected = true;
							self._trigger( "selected", event, {
								item: ui.item.option
							});
							$(this).hide();
							select.show();
						},
						change: function( event, ui ) {
							if ( !ui.item ) {
								var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
									valid = false;
								select.children( "option" ).each(function() {
									if ( this.value.match( matcher ) ) {
										this.selected = valid = true;
										return false;
									}
								});
								if ( !valid ) {
									// remove invalid value, as it didn't match anything
									$( this ).val( "" );
									select.val( "" );
									return false;
								}
							}
						}
					});
				input.data( "autocomplete" )._renderItem = function( ul, item ) {
					return $( "<li></li>" )
						.data( "item.autocomplete", item )
						.append( "<a>" + item.label + "</a>" )
						.appendTo( ul );
				};	
					
				$('<button id="search'+select.attr("name")+'" class="ui-state-default ui-corner-all"><span class="ui-icon ui-icon-search"></span></button>')
					.insertAfter(input)
					.mouseover(function() {
  						$(this).css('cursor', 'pointer');
  					})
  					.mouseout(function() {
  						$(this).css('cursor', 'default');
  					})
					.click(function(){
						maxLength = 0;
						select.children().each(function() {
						   if ($(this).text().length > maxLength){
		                   		maxLength = $(this).text().length;
		                   }
						});
						input.attr("size", maxLength);
					    select.toggle();
				    	input.toggle();
				    	
				    	if( input.is(':visible') ) {
				    		input.val(select.children( ":selected" ).text());
				    		input.focus();
				    	}
				    	
			    	});
			
			}
		});
})(jQuery);
