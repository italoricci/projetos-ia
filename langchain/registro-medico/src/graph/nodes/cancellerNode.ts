import { AppointmentService } from '../../services/appointmentService.ts';
import type { GraphState } from '../graph.ts';
import z from 'zod/v4';

const cancellationSchema = z.object({
  professionalId: z.number({ error: 'Id do agendamento é obrigatório' }),
  patientName: z.string({ error: 'Nome do paciente é obrigatório' }),
  datatime: z.string({ error: 'Data e hora são obrigatórios' }),
});

export function createCancellerNode(appointmentService: AppointmentService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`❌ Cancelling appointment...`);

    try {
      const validation = cancellationSchema.safeParse(state);
      if (!validation.success) {
        const errorMessages = validation.error;
        console.log(`❌ Cancellation failed: ${errorMessages}`);
        return {
          actionSuccess: false,
          actionError: `Cancellation failed: ${errorMessages}`,
        };
      }

      const canceledAppointment = appointmentService.cancelAppointment(
        validation.data.professionalId,
        validation.data.patientName || '',
        new Date(validation.data.datatime || ''),
      );

      console.log(`✅ Appointment cancelled successfully`);

      return {
        actionSuccess: true,
        appointmentData: canceledAppointment,
      };
    } catch (error) {
      console.log(
        `❌ Cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return {
        ...state,
        actionSuccess: false,
        actionError:
          error instanceof Error ? error.message : 'Cancellation failed',
      };
    }
  };
}
