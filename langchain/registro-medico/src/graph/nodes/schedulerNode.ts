import { AppointmentService } from '../../services/appointmentService.ts';
import type { GraphState } from '../graph.ts';
import z from 'zod/v4';

const scheduleSchema = z.object({
  professionalId: z.number({ error: 'Id do profissional é obrigatório' }),
  datetime: z.string({ error: 'Data e hora são obrigatórios' }),
  patientName: z.string({ error: 'Nome do paciente é obrigatório' }),
});

export function createSchedulerNode(appointmentService: AppointmentService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`📅 Scheduling appointment...`);
    try {
      const validation = scheduleSchema.safeParse(state);

      if (!validation.success) {
        const errorMessages = validation.error;
        console.log(`❌ Scheduling failed: ${errorMessages}`);
        return {
          actionSuccess: false,
          actionError: `Scheduling failed: ${errorMessages}`,
        };
      }

      const appointment = appointmentService.bookAppointment(
        validation.data.professionalId,
        new Date(validation.data.datatime),
        validation.data.patientName,
        state.reason || 'check-up regular',
      );

      console.log(`✅ Appointment scheduled successfully`);

      return {
        actionSuccess: true,
        appointmentData: appointment,
      };
    } catch (error) {
      console.log(
        `❌ Scheduling failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return {
        ...state,
        actionSuccess: false,
        actionError:
          error instanceof Error ? error.message : 'Scheduling failed',
      };
    }
  };
}
