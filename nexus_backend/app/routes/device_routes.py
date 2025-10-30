from flask import Blueprint, request, jsonify
from app.models.device_model import Device
from app.models.attendant_model import Attendant
from app.schemas.device_schema import DeviceSchema, DeviceRegisterSchema
from app import db
from datetime import datetime

device_bp = Blueprint("devices", __name__, url_prefix="/devices")

device_schema = DeviceSchema()
device_register_schema = DeviceRegisterSchema()
devices_schema = DeviceSchema(many=True)



# REGISTER A NEW DEVICE

@device_bp.route("/", methods=["POST"])
def register_device():
    data = request.get_json()

    errors = device_register_schema.validate(data)
    if errors:
        return jsonify({"errors": errors}), 400

    attendant_id = request.args.get("attendant_id")
    if not attendant_id:
        return jsonify({"error": "Missing attendant_id in query params"}), 400

    attendant = Attendant.query.get(attendant_id)
    if not attendant:
        return jsonify({"error": "Attendant not found"}), 404

    # Ensure BLE ID is unique
    existing_device = Device.query.filter_by(ble_id=data["ble_id"]).first()
    if existing_device:
        return jsonify({"error": "Device with this BLE ID already exists"}), 409

    new_device = Device(
        ble_id=data["ble_id"],
        device_name=data["device_name"],
        teacher_id=attendant.id,  # still mapped to teacher_id column
        last_activated=datetime.utcnow(),
    )

    db.session.add(new_device)
    db.session.commit()

    return jsonify({
        "message": "Device registered successfully",
        "device": device_schema.dump(new_device)
    }), 201



# GET ALL DEVICES

@device_bp.route("/", methods=["GET"])
def get_all_devices():
    devices = Device.query.all()
    return jsonify(devices_schema.dump(devices)), 200



# GET DEVICE BY ID

@device_bp.route("/<int:device_id>", methods=["GET"])
def get_device(device_id):
    device = Device.query.get_or_404(device_id)
    return jsonify(device_schema.dump(device)), 200



# ACTIVATE DEVICE

@device_bp.route("/<int:device_id>/activate", methods=["PATCH"])
def activate_device(device_id):
    device = Device.query.get_or_404(device_id)
    device.activate()
    db.session.commit()
    return jsonify({
        "message": "Device activated successfully",
        "device": device_schema.dump(device)
    }), 200



# DEACTIVATE DEVICE

@device_bp.route("/<int:device_id>/deactivate", methods=["PATCH"])
def deactivate_device(device_id):
    device = Device.query.get_or_404(device_id)
    device.deactivate()
    db.session.commit()
    return jsonify({
        "message": "Device deactivated successfully",
        "device": device_schema.dump(device)
    }), 200



# DELETE DEVICE

@device_bp.route("/<int:device_id>", methods=["DELETE"])
def delete_device(device_id):
    device = Device.query.get_or_404(device_id)
    db.session.delete(device)
    db.session.commit()
    return jsonify({"message": "Device deleted successfully"}), 200



# GET DEVICES BY ATTENDANT

@device_bp.route("/attendant/<int:attendant_id>", methods=["GET"])
def get_devices_by_attendant(attendant_id):
    attendant = Attendant.query.get(attendant_id)
    if not attendant:
        return jsonify({"error": "Attendant not found"}), 404

    devices = Device.query.filter_by(teacher_id=attendant.id).all()
    return jsonify({
        "attendant": {"id": attendant.id, "name": attendant.name},
        "devices": devices_schema.dump(devices)
    }), 200
