# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc
import warnings

import stateservice_pb2 as stateservice__pb2

GRPC_GENERATED_VERSION = '1.65.0'
GRPC_VERSION = grpc.__version__
EXPECTED_ERROR_RELEASE = '1.65.0'
SCHEDULED_RELEASE_DATE = 'June 25, 2024'
_version_not_supported = False

try:
    from grpc._utilities import first_version_is_lower
    _version_not_supported = first_version_is_lower(GRPC_VERSION, GRPC_GENERATED_VERSION)
except ImportError:
    _version_not_supported = True

if _version_not_supported:
    warnings.warn(
        f'The grpc package installed is at version {GRPC_VERSION},'
        + f' but the generated code in stateservice_pb2_grpc.py depends on'
        + f' grpcio>={GRPC_GENERATED_VERSION}.'
        + f' Please upgrade your grpc module to grpcio>={GRPC_GENERATED_VERSION}'
        + f' or downgrade your generated code using grpcio-tools<={GRPC_VERSION}.'
        + f' This warning will become an error in {EXPECTED_ERROR_RELEASE},'
        + f' scheduled for release on {SCHEDULED_RELEASE_DATE}.',
        RuntimeWarning
    )


class StateStub(object):
    """
    Comments in this file will be directly parsed into the API
    Documentation as descriptions of the associated method, message, or field.
    These descriptions should go right above the definition of the object, and
    can be in either block or // comment format.

    An RPC method can be matched to an lncli command by placing a line in the
    beginning of the description in exactly the following format:
    lncli: `methodname`

    Failure to specify the exact name of the command will cause documentation
    generation to fail.

    More information on how exactly the gRPC documentation is generated from
    this proto file can be found here:
    https://github.com/lightninglabs/lightning-api

    State service is a always running service that exposes the current state of
    the wallet and RPC server.
    """

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.SubscribeState = channel.unary_stream(
                '/lnrpc.State/SubscribeState',
                request_serializer=stateservice__pb2.SubscribeStateRequest.SerializeToString,
                response_deserializer=stateservice__pb2.SubscribeStateResponse.FromString,
                _registered_method=True)
        self.GetState = channel.unary_unary(
                '/lnrpc.State/GetState',
                request_serializer=stateservice__pb2.GetStateRequest.SerializeToString,
                response_deserializer=stateservice__pb2.GetStateResponse.FromString,
                _registered_method=True)


class StateServicer(object):
    """
    Comments in this file will be directly parsed into the API
    Documentation as descriptions of the associated method, message, or field.
    These descriptions should go right above the definition of the object, and
    can be in either block or // comment format.

    An RPC method can be matched to an lncli command by placing a line in the
    beginning of the description in exactly the following format:
    lncli: `methodname`

    Failure to specify the exact name of the command will cause documentation
    generation to fail.

    More information on how exactly the gRPC documentation is generated from
    this proto file can be found here:
    https://github.com/lightninglabs/lightning-api

    State service is a always running service that exposes the current state of
    the wallet and RPC server.
    """

    def SubscribeState(self, request, context):
        """SubscribeState subscribes to the state of the wallet. The current wallet
        state will always be delivered immediately.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetState(self, request, context):
        """GetState returns the current wallet state without streaming further
        changes.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_StateServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'SubscribeState': grpc.unary_stream_rpc_method_handler(
                    servicer.SubscribeState,
                    request_deserializer=stateservice__pb2.SubscribeStateRequest.FromString,
                    response_serializer=stateservice__pb2.SubscribeStateResponse.SerializeToString,
            ),
            'GetState': grpc.unary_unary_rpc_method_handler(
                    servicer.GetState,
                    request_deserializer=stateservice__pb2.GetStateRequest.FromString,
                    response_serializer=stateservice__pb2.GetStateResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'lnrpc.State', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))
    server.add_registered_method_handlers('lnrpc.State', rpc_method_handlers)


 # This class is part of an EXPERIMENTAL API.
class State(object):
    """
    Comments in this file will be directly parsed into the API
    Documentation as descriptions of the associated method, message, or field.
    These descriptions should go right above the definition of the object, and
    can be in either block or // comment format.

    An RPC method can be matched to an lncli command by placing a line in the
    beginning of the description in exactly the following format:
    lncli: `methodname`

    Failure to specify the exact name of the command will cause documentation
    generation to fail.

    More information on how exactly the gRPC documentation is generated from
    this proto file can be found here:
    https://github.com/lightninglabs/lightning-api

    State service is a always running service that exposes the current state of
    the wallet and RPC server.
    """

    @staticmethod
    def SubscribeState(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_stream(
            request,
            target,
            '/lnrpc.State/SubscribeState',
            stateservice__pb2.SubscribeStateRequest.SerializeToString,
            stateservice__pb2.SubscribeStateResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)

    @staticmethod
    def GetState(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/lnrpc.State/GetState',
            stateservice__pb2.GetStateRequest.SerializeToString,
            stateservice__pb2.GetStateResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)