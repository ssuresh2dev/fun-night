from flask import Blueprint
from templates.src import constants

blueprint = Blueprint('src',__name__)


@blueprint.route('/api/get_all_roles')
def get_all_roles():
    return {
        'data': constants.ALL_ROLES
    }
