package com.vega.app

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class VegaViewModel : ViewModel() {
    private val api = VegaApi()
    private val telemetry = Telemetry()
    private val soundscape = Soundscape()

    private val _state = MutableStateFlow(VegaState())
    val state: StateFlow<VegaState> = _state

    init {
        refresh()
    }

    fun refresh() {
        CoroutineScope(Dispatchers.IO).launch {
            val snapshot = api.dashboard()
            _state.value = _state.value.copy(status = snapshot.status, modules = snapshot.modules)
            telemetry.log("dashboard_loaded")
        }
    }

    suspend fun playSoundscape(id: String) {
        soundscape.play(id)
        telemetry.log("soundscape_play", mapOf("id" to id))
    }
}

data class VegaState(
    val status: String = "Connecting",
    val modules: List<String> = listOf("Story Engine", "Vision Engine", "Whitepaper Portal")
)
