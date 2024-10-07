
$(function(){

	var arr_active_nav = [];

	//return an array of objects according to key, value, or key and value matching
	function getObjects(obj, key, val) {
	    var objects = [];
	    for (var i in obj) {
	        if (!obj.hasOwnProperty(i)) continue;
	        if (typeof obj[i] == 'object') {
	            objects = objects.concat(getObjects(obj[i], key, val));    
	        } else 
	        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
	        if (i == key && obj[i] == val || i == key && val == '') { //
	            objects.push(obj);
	        } else if (obj[i] == val && key == ''){
	            //only add if the object is not already in the array
	            if (objects.lastIndexOf(obj) == -1){
	                objects.push(obj);
	            }
	        }

	    }
	    return objects;
	}

	function getParentPath(path){
		var parent_path = path.replace( path.substr( path.lastIndexOf('/',path.length-2) +1 ), '');
		return parent_path;
	}

	// Get array containing nodes from root to current page in IA
	function getAncestors(path, data){
		var arr_path = path.split("/"),			
			arr_ancestors = [],
			str_path='',
			current_node,
			obj = {};


			for(i=0;i< (arr_path.length) ;i++){

				if($.trim(arr_path[i])!=''){
					str_path += '/' + arr_path[i];
					current_node = getObjects(data, 'url', str_path + "/");				
					obj = {};

					if(current_node[0]!=undefined){
						obj.url = current_node[0].url;
						obj.title = current_node[0].title;

						if(i<4){
							arr_active_nav.push(obj.title);
						}
						
						arr_ancestors.push(obj);	
					}
				}
			}
		

		return arr_ancestors;
	}

	function setActiveNav(path, data, arr_active_nav){
		var arr_idx = [],
			loop_count = arr_active_nav.length,
			primary,
			secondary,
			mobile_primary,
			mobile_secondary;
		

		if(path=='/'){
			$('.primary-nav-item').eq(0).addClass('active');
		}else{
			for(i=0;i<data.length;i++){
				if(data[i].title==arr_active_nav[0]){
					
					primary = $('.primary-nav-item').eq(i+1);
					primary.addClass("active");

					mobile_primary = $('.mobile-nav > .list > .mobile-nav-item').eq(i+2);
					mobile_primary.addClass('active');

					loop_count--;
					if(loop_count==0) break;

					for(j=0; j<data[i].siteMapNode.length; j++){
						if(data[i].siteMapNode[j].title==arr_active_nav[1]){
							
							secondary = primary.find('.mega-nav > .list > .mega-nav-item').eq(j);
							secondary.addClass('active');

							mobile_secondary = mobile_primary.children('.mobile-nav-subpanel').children('.mobile-subnav').children('.mobile-nav-item').eq(j);
							mobile_secondary.addClass('active');

							loop_count--;
							if(loop_count==0) break;

							for(k=0; k<data[i].siteMapNode[j].siteMapNode.length; k++){

								if(data[i].siteMapNode[j].siteMapNode[k].title==arr_active_nav[2]){
									
									secondary.find('.mega-nav-item').eq(k).addClass('active');
									mobile_secondary.children('.mobile-nav-subpanel').children('.mobile-subnav').children('.mobile-nav-item').eq(k).addClass('active');
									break;
								}
							}
						}
					}
				}
			}
		}
	}


	//// Register custom Handlebars helper as equal comparison function
	//Handlebars.registerHelper('equal', function(v1, v2, options) {
	// 	if(v1 === v2) {
	//    	return options.fn(this);
	//  	}
	//  	return options.inverse(this);
	//}); 

	//// Register custom Handlebars helper as equal comparison function
	//Handlebars.registerHelper('notequal', function(v1, v2, options) {
	// 	if(v1 !== v2) {
	//    	return options.fn(this);
	//  	}
	//  	return options.inverse(this);
	//}); 
	
	/*
	$.getJSON(h_config.rschost + '/js/hdb-ia.json',function(data){
		
		var path = window.location.pathname,
			parent_path = getParentPath(path),
			parent_node = getObjects(data, 'url', parent_path),
			active_node = getObjects(parent_node,'url', path)[0],
			grandparent_node,
			html,
			source,
			template,
			ancestors = getAncestors(path, data);
		
		
		setActiveNav(path, data.siteMap.siteMapNode.siteMapNode, arr_active_nav);

		if($('.secondary-nav').length>0){

			//Get the Template from secondary-nav.php	        
	        source = $('#handlebar-nav').html();
	         
	        //Compile the actual Template file
	        template = Handlebars.compile(source);
	         
	        //Generate some HTML code from the compiled Template
	        

	        	// if it's the last node (has no children)
				grandparent_node = getObjects(data, 'url', getParentPath(parent_path) );

				html = template({ 
		        	parent_node : grandparent_node[0].siteMapNode, 
		        	active_node : active_node,
		        	parent_url  : parent_node[0].url,
		        	ancestors 	: ancestors,
		        	active_parent_url : grandparent_node[0].url
		        });
			

			//Replace the side navigation section with the new code.
	        $('.secondary-nav').html(html);

	        // Set page title
	        if( document.getElementById('handlebar-title')!=null){
				
				source = $('#handlebar-title').html();
				template = Handlebars.compile(source);
				html = template({				
					active_node : active_node 
				});

		        $('#dynamic-title').html(html);
	    	}
    	}

    	if($('.hdb-breadcrumbs').length>0 && document.getElementById('handlebar-breadcrumbs')!=null){
    		//Get the Template from breadcrumbs.php	        
	        source = $('#handlebar-breadcrumbs').html();
	         
	        //Compile the actual Template file
	        template = Handlebars.compile(source);

	        html = template({ 
	        	ancestors : ancestors,
	        	active_node : active_node
	        });

	        $('.hdb-breadcrumbs').html(html);
    	}

	});
	
	*/
});