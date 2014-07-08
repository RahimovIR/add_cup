# -*- coding: utf-8 -*-
# Create your views here.
from django.shortcuts import render_to_response
from django.template import RequestContext
from django import forms
from .forms import genTeamGroupField


def gen_base_forms():
    choices_for_tour_type = (
        ('', '-------'),
        ('group', 'Группа'),
        ('butt', 'Стыковочные матчи')
    )
    fields = {
        'tour_type': forms.ChoiceField(choices=choices_for_tour_type),
    }
    return type('emptyForm', (forms.Form,), fields)


def gen_group_forms(baseForm, data=None, prefix='form'):
    baseForm.base_fields['number_groups'] = forms.IntegerField(min_value=1, max_value=20)
    baseForm.base_fields['number_team_in_group'] = forms.IntegerField(min_value=2, max_value=20)
    group_form = baseForm(data, prefix=prefix)
    if group_form.is_valid():
        number_groups = group_form.cleaned_data['number_groups']
        number_team_in_group = group_form.cleaned_data['number_team_in_group']
        for i in range(number_groups):
            baseForm.base_fields['group_%i' % i] = genTeamGroupField(number_team_in_group)
        group_form = baseForm(data, prefix=prefix)
    return group_form


def gen_butt_forms(baseForm, data=None, prefix='form'):
    baseForm.base_fields['number_teams'] = forms.IntegerField(min_value=2)
    butt_form = baseForm(data, prefix=prefix)
    if butt_form.is_valid():
        number_teams = butt_form.cleaned_data['number_teams']
        for i in range(number_teams):
            baseForm.base_fields['team_%i' % i] = forms.CharField()
        butt_form = baseForm(data, prefix=prefix)
    return butt_form


def get_tours_form(data=None, prefix='form'):
    baseForm = gen_base_forms()
    base_form = baseForm(data, prefix=prefix)
    if base_form.is_valid():
        if base_form.cleaned_data['tour_type'] == 'group':
            return gen_group_forms(baseForm, data, prefix)
        elif base_form.cleaned_data['tour_type'] == 'butt':
            return gen_butt_forms(baseForm, data, prefix)
        else:
            return base_form
    return base_form


def get_cup_head_form(data=None):
    class cupHeadForm(forms.Form):
        name = forms.CharField()
        number_tours = forms.IntegerField(min_value=1)

    return cupHeadForm(data)


def home(request):
    if request.method == "POST":

        cup_head_form = get_cup_head_form(request.POST)

        number_tours = 1
        if cup_head_form.is_valid():
            number_tours = cup_head_form.cleaned_data['number_tours']

        tour_list = []
        clear_data_list = []
        for i in range(number_tours):
            form = get_tours_form(data=request.POST, prefix='tour_%i' % i)
            tour_list.append(form)
            if form.is_valid():
                clear_data_list.append(form.cleaned_data)
            # import ipdb; ipdb.set_trace()
        return render_to_response('FirstForm/home.html', 
            {'tour_list': tour_list, 'cup_head_form': cup_head_form, 'clear_data_list': clear_data_list},
            context_instance=RequestContext(request))
    else:
        def add_prefix_in_key(dict, prefix=None):
            if dict is None:
                return dict
            if prefix is None:
                return dict

            new_dict = {}
            for key, val in dict.iteritems():
                new_dict[prefix + '-' + key] = val
            return new_dict

        cup_head_form = get_cup_head_form()

        data = {'group_2': u'h', 'group_1': u'g', 'number_group': 3, 'tour_type': u'group', 'group_0': u'd'}
        data_list = [None, None, None]
        tour_list = []
        for i in range(1):
            prefix = 'tour_%i' % i
            prefix_data = add_prefix_in_key(data_list[i], prefix)
            tour_list.append(get_tours_form(data=prefix_data, prefix=prefix))
        return render_to_response('FirstForm/home.html', {'tour_list': tour_list, 'cup_head_form': cup_head_form},
                                  context_instance=RequestContext(request))