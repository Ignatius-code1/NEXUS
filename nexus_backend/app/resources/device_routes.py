from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.device_model import Device
from app.schemas.device_schema import DeviceCreateSchema, DeviceResponseSchema

device_bp = Blueprint('device_bp', __name__)

@device_bp.route('/devices', methods=['POST'])
@jwt_required()
def register_device():
    current_user_id = get_jwt_identity()
    schema = DeviceCreateSchema()
    data = schema.load(request.json)
    
    # Check if device already exists
    existing = Device.query.filter_by(ble_id=data['ble_id']).first()
    if existing:
        return jsonify({'error': 'Device already registered'}), 400
    
    device = Device(
        attendant_id=current_user_id,
        ble_id=data['ble_id'],
        device_name=data.get('device_name', 'Unknown Device')
    )
    
    db.session.add(device)
    db.session.commit()
    
    return jsonify(DeviceResponseSchema().dump(device.__dict__)), 201

@device_bp.route('/devices', methods=['GET'])
@jwt_required()
def get_devices():
    current_user_id = get_jwt_identity()
    devices = Device.query.filter_by(attendant_id=current_user_id).all()
    return jsonify([DeviceResponseSchema().dump(d.__dict__) for d in devices])

@device_bp.route('/devices/<int:device_id>/activate', methods=['POST'])
@jwt_required()
def activate_device(device_id):
    device = Device.query.get(device_id)
    if not device:
        return jsonify({'error': 'Device not found'}), 404
    
    device.activate()
    db.session.commit()
    
    return jsonify({'message': 'Device activated', 'device': DeviceResponseSchema().dump(device.__dict__)})

@device_bp.route('/devices/<int:device_id>/deactivate', methods=['POST'])
@jwt_required()
def deactivate_device(device_id):
    device = Device.query.get(device_id)
    if not device:
        return jsonify({'error': 'Device not found'}), 404
    
    device.deactivate()
    db.session.commit()
    
    return jsonify({'message': 'Device deactivated', 'device': DeviceResponseSchema().dump(device.__dict__)})