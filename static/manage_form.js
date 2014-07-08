$( document ).ready(function() {
	
	$('#id_number_tours').val(number_rounds());

	$('#id_number_tours').change(function(elm){
		new_val = parseInt($(elm.target).val());
		change_number_rounds(new_val);
	});

	$('select[id^=id_tour_][id$=-tour_type]').change(function(elm) {
		add_fields_for_round(elm.target);
	});

	$('input[id^=id_tour_][id$=-number_groups]').each(function(index, ng_elm) {
		var first_part_id = $(ng_elm).attr('id').match(/id_tour_\d+-/);
		var tg_elm = $('#' + first_part_id + 'number_team_in_group');
		var prefix = $(ng_elm).attr('id').match(/tour_\d+/)[0];
		$(ng_elm).change(function(event) {
			add_groups(tg_elm, $(ng_elm), prefix)
		});
		$(tg_elm).change(function(event) {
			add_groups(tg_elm, $(ng_elm), prefix)
		});
	});

	$('input[id^=id_tour_][id$=-number_teams]').each(function(index, elm) {
		var prefix = $(elm).attr('id').match(/tour_\d+/)[0];
		$(elm).change(function(event) {
			add_butt_teams($(elm), prefix);
		});
	});

});
// <input id="id_tour_2-number_teams" name="tour_2-number_teams" value="2" type="text">

function number_rounds(){
	var all_number_rounds = 0;
	$('select[id^=id_tour_][id$=-tour_type]').each(function(index, el) {
		all_number_rounds += 1;
		// console.log(el);
		// console.log($(el).attr('id'));
	});
	return all_number_rounds;
}

function change_number_rounds(new_num){
	var cur_num = number_rounds();
	if (new_num > cur_num) {
		add_new_rounds(new_num - cur_num);
	}else if (new_num < cur_num) {
		remove_last_rounds(cur_num - new_num);
	}

	$('select[id^=id_tour_][id$=-tour_type]').change(function(elm) {
		add_fields_for_round(elm.target);
	});
}

function add_new_rounds(new_num){
	function update_id(el, num){
		if(el.is('label')){
			for_attr = el.attr('for');
			el.attr('for', for_attr.replace(/\d+/, num));
		}else if(el.is('select')){
			id_attr = el.attr('id');
			name_attr = el.attr('name');
			el.attr('id', id_attr.replace(/\d+/, num));
			el.attr('name', name_attr.replace(/\d+/, num));
		}
	}

	var last_elm = null;
	var last_elm_id = null;
	$('select[id^=id_tour_][id$=-tour_type]').each(function(index, el) {
		last_elm = el;
	});

	last_elm_id = $(last_elm).attr('id');
	last_label_elm = $('label[for=id]'.replace(/id/, last_elm_id)).first();
	submit_elm = $(':submit').first();

	num_prefix = parseInt(last_elm_id.match(/tour_(\d+)/)[1]);

	for (var i = 1; i <= new_num; i++) {	
		new_elm = $(last_elm).clone();
		new_elm.val('');
		new_label_elm = $(last_label_elm).clone();

		update_id(new_label_elm, num_prefix + i);
		update_id(new_elm, num_prefix + i);

		$(new_label_elm).insertBefore($(submit_elm));
		$(new_elm).insertBefore($(submit_elm));
		$("<br>").insertBefore($(submit_elm));
	};
}

function remove_last_rounds(del_num){
	$($('select[id^=id_tour_][id$=-tour_type]').get().reverse()).each(function(index, el) {
		if (index >= del_num){
			return null;
		}
		elm_id = $(el).attr('id');
		prefix = elm_id.match(/id_tour_\d+/)[0];

		$('label[for^=prefix]'.replace(/prefix/, prefix)).each(function(index, el) {
			el.remove();
		});
		$('input[id^=prefix]'.replace(/prefix/, prefix)).each(function(index, el) {
			el.remove();
		});
		$(el).next().remove();
		el.remove();
	});
}

function add_fields_for_round(elm){
	var round_type = $(elm).val();
	var prefix = $(elm).attr('id').match(/tour_\d+/)[0];
	if(round_type == 'group'){
		clean_round_fields(prefix);
		add_group_fields(elm, prefix);
	}else if(round_type == 'butt'){
		clean_round_fields(prefix);
		add_butt_fields(elm, prefix);
	}else{
		console.log('clean round');
		clean_round_fields(prefix);
	}
}

function clean_round_fields(prefix){
	$('input[id^=id_prefix]'.replace(/prefix/, prefix)).each(function(index, el) {
		id = $(el).attr('id');
		$('label[for=id]'.replace(/id/, id)).each(function(index, el) {
			el.remove();
		});
		el.remove();
	});
}

function add_group_fields(elm, prefix){
	var team_in_group = $('<input/>', {
		id: "id_prefix-number_team_in_group".replace(/prefix/, prefix),
		name: "prefix-number_team_in_group".replace(/prefix/, prefix),
		type: "text"
	});
	var label_team_in_group = $('<label/>', {
		for: "id_prefix-number_team_in_group".replace(/prefix/, prefix)
	}).text('Number team in group:');

	var number_groups = $('<input/>', {
		id: "id_prefix-number_groups".replace(/prefix/, prefix),
		name: "prefix-number_groups".replace(/prefix/, prefix),
		type: "text"	
	});
	var label_number_groups = $('<label/>', {
		for: "id_prefix-number_groups".replace(/prefix/, prefix)
	}).text('Number groups:');

	team_in_group.change(function(event) {
		add_groups(team_in_group, number_groups, prefix)
	});
	number_groups.change(function(event) {
		add_groups(team_in_group, number_groups, prefix)
	});

	team_in_group.insertAfter(elm);
	label_team_in_group.insertAfter(elm);
	number_groups.insertAfter(elm);
	label_number_groups.insertAfter(elm);
}

function add_groups(team_in_group, number_groups, prefix){
	function clean_groups(prefix){
		$('input[id^=id_prefix-group_]'.replace(/prefix/, prefix)).each(function(index, el) {
			el.remove();
		});
		$('label[for^=id_prefix-group_]'.replace(/prefix/, prefix)).each(function(index, el) {
			el.remove();
		});
	}
	team_in_group_int = parseInt(team_in_group.val());
	number_groups_int = parseInt(number_groups.val());
	last_elm = team_in_group;
	if(team_in_group_int &&  number_groups_int){
		clean_groups(prefix);
		for (var i = 0; i < number_groups_int; i++) {
			var i_str = i.toString();
			//<label for="id_tour_0-group_0_0">Group 0:</label>
			group_label = $('<label/>', {
				for: "id_prefix-group_".replace(/prefix/, prefix) + i_str + '_0'
			});
			group_label.text('Group ' + i_str);
			group_label.insertAfter(last_elm);
			last_elm = group_label;
			for (var j = 0; j < team_in_group_int; j++) {
				j_str = i_str + '_' + j.toString(); //i_j
				//<input id="id_tour_0-group_0_0" name="tour_0-group_0_0" type="text">
				team_input = $('<input/>', {
					id: "id_prefix-group_".replace(/prefix/, prefix) + j_str,
					name: "prefix-group_".replace(/prefix/, prefix) + j_str,
					type: "text"
				})
				team_input.insertAfter(last_elm);
				last_elm = team_input;
			};
		};
	}
}

function add_butt_fields(elm, prefix){
	var number_teams = $('<input/>', {
		id: "id_prefix-number_teams".replace(/prefix/, prefix),
		name: "prefix-number_teams".replace(/prefix/, prefix),
		type: "text"
	});
	var label_number_teams = $('<label/>', {
		for: "id_prefix-number_teams".replace(/prefix/, prefix)
	}).text('Number teams:');

	number_teams.change(function(event) {
		add_butt_teams(number_teams, prefix);
	});
	number_teams.insertAfter(elm);
	label_number_teams.insertAfter(elm);
}

function add_butt_teams(number_teams, prefix){
	function clean_fields(prefix){
		$('input[id^=id_prefix-team_]'.replace(/prefix/, prefix)).each(function(index, el) {
			el.remove();
		});
		$('label[for^=id_prefix-team_]'.replace(/prefix/, prefix)).each(function(index, el) {
			el.remove();
		});
	}

	number_teams_int = parseInt(number_teams.val());
	if(number_teams_int){
		last_elm = number_teams;
		clean_fields(prefix);
		for (var i = 0; i < number_teams_int; i++) {
			team_label = $('<label/>', {
				for: "id_prefix-team_".replace(/prefix/, prefix) + i.toString()
			}).text('Team ' + i.toString());
			team_input = $('<input/>', {
				id: "id_prefix-team_".replace(/prefix/, prefix) + i.toString(),
				name: "prefix-team_".replace(/prefix/, prefix) + i.toString(),
				type: "text"
			});
			team_input.insertAfter(last_elm);
			team_label.insertAfter(last_elm);

			last_elm = team_input;
		};
	}
}

// <label for="id_tour_2-team_0">Team 0:</label>