# -*- coding: utf-8 -*-
from django import forms

def genTeamGroupField(number_fields):
    class TeamGroupWidget(forms.widgets.MultiWidget):
        def __init__(self, attrs=None):
            widgets = [forms.TextInput() for i in range(number_fields)]
            super(TeamGroupWidget, self).__init__(widgets, attrs)

        def decompress(self, value):
            if value:
                return value
            else:
                return ['' for i in range(number_fields)]


    class TeamGroupField(forms.fields.MultiValueField):
        widget = TeamGroupWidget

        def __init__(self, *args, **kwargs):
            list_fields = [forms.fields.CharField() for i in range(number_fields)]
            super(TeamGroupField, self).__init__(list_fields, *args, **kwargs)

        def compress(self, values):
            return values

    return TeamGroupField()